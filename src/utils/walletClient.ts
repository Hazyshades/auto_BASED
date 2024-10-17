import { Hex } from "viem";
import { makeLogger } from "../logger";
import { JsonRpcProvider, ethers, formatUnits, toBeHex } from "ethers";
import { token } from "../models/token";
import { generalConfig } from "../../config";
import { sleep } from "./common";
import { erc20Abi } from "../abi/erc20abi";
import { wallet } from "../models/wallet";
import { chain } from "../models/chain";

export class WalletClient {
    public walletData: wallet;
    public chain: chain;

    provider: JsonRpcProvider;
    walletEthers: ethers.Wallet;
    walletAddress: string;

    private _logger: any;
    private _privateKey: string;

    constructor(walletData: wallet, chain: chain, logger?: string) {
        this.walletData = walletData;
        this._privateKey = this.walletData.privateKey;
        this.walletAddress = this.walletData.address;
        this.chain = chain;
        this._logger = makeLogger(logger ? `${logger} | WalletClient` : "WalletClient");
        this._init();

        this.provider = new ethers.JsonRpcProvider(this.chain.rpc);
        this.walletEthers = new ethers.Wallet(this._privateKey, this.provider);
    }

    private _init() {
        while (true) {
            try {
                this.provider = new ethers.JsonRpcProvider(this.chain.rpc);
                this.walletEthers = new ethers.Wallet(this._privateKey, this.provider);
                break;
            } catch (error) {

            }
        }
    }

    async gasChecker() {
        while (true) {
            try {
                const { maxPriorityFeePerGas, maxFeePerGas, gasPrice } = await this.provider.getFeeData();
                const gas = gasPrice ?? maxFeePerGas ?? maxPriorityFeePerGas;

                if (gas == null) {
                    continue;
                }

                const gwei = Number(formatUnits(gas, 'gwei'));

                if (gwei < generalConfig.maxGwei[this.chain.name] || generalConfig.maxGwei[this.chain.name] == undefined) {
                    return;
                }

                console.log(`${this.walletData.name} | Now Gas is ${gwei} Gwei in ${this.chain.name}, wait ${generalConfig.maxGweiDelay} sec and retry check`);
                await sleep(generalConfig.maxGweiDelay);

            } catch (error) {
                this._logger.error(error);

                this.provider = new ethers.JsonRpcProvider(this.chain.rpc);
            }
        };
    }

    async balanceOf(token?: token): Promise<bigint> {
        let balance;
        let attempts = 0;

        while (attempts < generalConfig.attempts) {
            try {
                if (token == undefined || token.name == this.chain.token) {
                    balance = await this.provider.getBalance(this.walletAddress);
                } else {
                    const tokenContract = await new ethers.Contract(token.address[this.chain.name], erc20Abi, this.provider);
                    balance = await tokenContract.balanceOf(this.walletAddress);
                }
                break;
            } catch (error) {
                this._logger.error(error);

                attempts++;
                this._logger.info(`${this.walletData.name} | ${this.chain.name} | Wait ${generalConfig.attemptsDelay} sec and retry balance of ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                this.provider = new ethers.JsonRpcProvider(this.chain.rpc);

                if (attempts === generalConfig.attempts) { break }
            }
        }

        if (balance == undefined) {
            throw new Error(`${this.walletData.name} | ${this.chain.name} | Failed to fetch the balance after multiple attempts.`);
        }

        return balance;
    }

    async approve(contract: Hex, token: token | token[], amount: bigint | bigint[]) {
        const tokens = Array.isArray(token) ? token : [token];
        const amounts = Array.isArray(amount) ? amount : [amount];

        for (let i = 0; i < tokens.length; i++) {
            let attempts = 0;

            while (attempts < generalConfig.attempts) {
                try {
                    const tokenContract = new ethers.Contract(tokens[i].address[this.chain.name], erc20Abi, this.walletEthers);
                    const tx = await tokenContract.approve(contract, amounts[i]);
                    try {
                        await this.provider.waitForTransaction(tx.hash, undefined, 300000);
                    } catch (error) {
                        console.log(error);
                    }
                    let receipt = await this.provider.getTransactionReceipt(tx.hash);

                    if (receipt == undefined || receipt.status == 0) {
                        throw new Error('approve is undefined');
                    }

                    this._logger.info(`${this.walletData.name} | ${this.chain.name} | Success approve ${amounts[i]} ${tokens[i].name}`);
                    break;
                } catch (error) {
                    this._logger.error(error);

                    attempts++;
                    this._logger.info(`${this.walletData.name} | ${this.chain.name} | Wait ${generalConfig.attemptsDelay} sec and retry approve ${attempts}/${generalConfig.attempts}`);
                    await sleep(generalConfig.attemptsDelay);

                    this.provider = new ethers.JsonRpcProvider(this.chain.rpc);
                    this.walletEthers = new ethers.Wallet(this._privateKey, this.provider);

                    if (attempts === generalConfig.attempts) { break }
                }
            }
        }
    }

    async signTypedData(domain: any, types: any, quoteToSign: any) {
        let attempts = 0;

        while (attempts < generalConfig.attempts) {
            try {
                let signature = await this.walletEthers.connect(this.provider).signTypedData(domain, types, quoteToSign);
                return signature;
            } catch (error) {
                this._logger.error(error);

                attempts++;
                this._logger.info(`${this.walletData.name} | ${this.chain.name} | Wait ${generalConfig.attemptsDelay} sec and retry sign quote ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                this.provider = new ethers.JsonRpcProvider(this.chain.rpc);
                this.walletEthers = new ethers.Wallet(this._privateKey, this.provider);

                if (attempts === generalConfig.attempts) { break }
            }
        }
    }

    async prepareTransaction(value?: any): Promise<ethers.TransactionRequest> {
        const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = await this.provider.getFeeData();

        const tx: ethers.TransactionRequest = {
            chainId: this.chain.chainId,
            from: this.walletData.address,
            value: value,
            nonce: await this.provider.getTransactionCount(
                this.walletData.address,
                "latest"
            ),
            maxFeePerGas: maxFeePerGas,
            maxPriorityFeePerGas: maxPriorityFeePerGas,
            gasLimit: toBeHex(0x100000), // 100000
        }

        if (maxFeePerGas == null && gasPrice != null) {
            tx.gasPrice = gasPrice;
        }

        return tx;
    }

    async sendTransaction(request: any) {
        let attempts = 0;

        while (attempts < generalConfig.attempts) {
            try {
                let response = await this.walletEthers.sendTransaction(request);

                try {
                    await this.provider.waitForTransaction(response.hash, undefined, 300000);
                } catch (error) {
                    this._logger.error(error);
                }

                let receipt = await this.provider.getTransactionReceipt(response.hash);
                if (receipt?.status == 1) {
                    return receipt;
                }
            } catch (error) {
                this._logger.error(error);

                attempts++;
                this._logger.info(`${this.walletData.name} | ${this.chain.name} | Wait ${generalConfig.attemptsDelay} sec and retry send transaction ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                this.provider = new ethers.JsonRpcProvider(this.chain.rpc);
                this.walletEthers = new ethers.Wallet(this._privateKey, this.provider);

                if (attempts === generalConfig.attempts) { break }
            }
        }
    }

    async sendTransactionOnce(transaction: any) {
        let tx = await this.walletEthers.connect(this.provider).sendTransaction(transaction);
        try {
            await this.provider.waitForTransaction(tx.hash, undefined, 300000);
        } catch (error) {
            this._logger.error(error);
        }
        return this.provider.getTransactionReceipt(tx.hash);
    }

    async transfer(token: token, amount: bigint, address: string) {
        let attempts = 0;

        while (attempts < generalConfig.attempts) {
            try {
                let tx: ethers.TransactionRequest;
                if (token == undefined || token.name == this.chain.token) {
                    const { gasPrice, maxFeePerGas, maxPriorityFeePerGas } = await this.provider.getFeeData();

                    tx = {
                        from: this.walletAddress,
                        to: address,
                        value: amount,
                        nonce: await this.provider.getTransactionCount(
                            this.walletAddress,
                            "latest"
                        ),
                        gasLimit: toBeHex(0x100000), // 100000,
                        maxFeePerGas: maxFeePerGas,
                        maxPriorityFeePerGas: maxPriorityFeePerGas
                    }

                    if (maxFeePerGas == null) {
                        tx.gasPrice = gasPrice;
                    }
                } else {
                    const tokenContract = await new ethers.Contract(token.address[this.chain.name], erc20Abi, this.provider);
                    const transfer = await tokenContract.transfer.populateTransaction(address, amount);
                    tx = await this.prepareTransaction();
                    tx.to = transfer.to;
                    tx.data = transfer.data;
                }

                const receipt = await this.sendTransactionOnce(tx);
                if (receipt?.status == 1) {
                    this._logger.info(`${this.walletData.name} | ${this.chain.name} | Success transfer ${this.chain.scan}/${receipt?.hash}`);
                    break;
                } else {
                    throw Error("Transfer failed");
                }
            } catch (error) {
                this._logger.error(error);

                attempts++;
                this._logger.info(`${this.walletData.name} | ${this.chain.name} | Wait ${generalConfig.attemptsDelay} sec and retry transfer ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                this.provider = new ethers.JsonRpcProvider(this.chain.rpc);
                this.walletEthers = new ethers.Wallet(this._privateKey, this.provider);

                if (attempts === generalConfig.attempts) { break }
            }
        }
    }

    async transferErc20Token(token: token, amount: bigint, address: string) {
        let attempts = 0;

        while (attempts < generalConfig.attempts) {
            try {
                const tokenContract = new ethers.Contract(token.address[this.chain.name], erc20Abi, this.walletEthers);
                await tokenContract.transfer(address, amount);
                break;
            } catch (error) {
                this._logger.error(error);

                attempts++;
                this._logger.info(`${this.walletData.name} | ${this.chain.name} | Wait ${generalConfig.attemptsDelay} sec and retry erc20 transfer ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                this.provider = new ethers.JsonRpcProvider(this.chain.rpc);
                this.walletEthers = new ethers.Wallet(this._privateKey, this.provider);

                if (attempts === generalConfig.attempts) { break }
            }
        }
    }

    async transferNativeToken(amount: bigint, address: string): Promise<boolean | undefined> {
        let attempts = 0;

        while (attempts < generalConfig.attempts) {
            try {
                const fee = await this.provider.getFeeData();

                const tx: ethers.TransactionRequest = {
                    from: this.walletAddress,
                    to: address,
                    value: amount,
                    nonce: await this.provider.getTransactionCount(
                        this.walletAddress,
                        "latest"
                    ),
                    gasLimit: toBeHex(0x100000), // 100000
                    gasPrice: fee.gasPrice,
                }

                await this.walletEthers.sendTransaction(tx);
                return true;
            } catch (error) {
                this._logger.error(error);

                attempts++;
                this._logger.info(`${this.walletData.name} | ${this.chain.name} | Wait ${generalConfig.attemptsDelay} sec and retry native transfer ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                this.provider = new ethers.JsonRpcProvider(this.chain.rpc);
                this.walletEthers = new ethers.Wallet(this._privateKey, this.provider);

                if (attempts === generalConfig.attempts) { return false; }
            }
        }
    }
}