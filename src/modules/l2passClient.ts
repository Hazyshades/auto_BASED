import { Hex } from "viem";
import { generalConfig, l2passConfig } from "../../config";
import { getRandomValue, sleep } from "../helpers";
import { makeLogger } from "../logger";
import { chain } from "../models/chain";
import { wallet } from "../models/wallet";
import { WalletClient } from "../utils/walletClient";
import { l2passAbi } from "../abi/l2passAbi";
import { MOONBEAM, kavaEVM } from "../data/chains";
import { refuel } from "../models/l2pass";
import { JsonRpcApiProvider, Wallet, ethers, toBeHex } from "ethers";
import { LAYERZERO_CHAINS_ID } from "../data/l0chains";

export class l2passClient {
    walletData: wallet;
    walletEthers: Wallet;
    chain: chain;
    paramDomain: any;
    logger: any;
    loggerName: string = "L2PassClient";
    provider: JsonRpcApiProvider;

    l2passContract: Hex = '0x222228060E7Efbb1D78BB5D454581910e3922222';

    constructor(walletData: wallet, chain: chain, logger?: string) {
        this.walletData = walletData;
        this.chain = chain;

        this.loggerName = logger ? `${logger} | ${this.loggerName}` : this.loggerName;
        this.logger = makeLogger(this.loggerName);

        this.provider = new ethers.JsonRpcProvider(this.chain.rpc);
        this.walletEthers = new ethers.Wallet(this.walletData.privateKey, this.provider);
    }

    public async refuel(toChain: chain) {
        const toChainAmount = l2passConfig.chainAmount.find(x => x.chain.chainId == toChain.chainId);
        if (toChainAmount == undefined) {
            return;
        }
        const toChainId = LAYERZERO_CHAINS_ID[toChain.name];
        const amount = getRandomValue(toChainAmount.amount).toFixed(8);
        const value = ethers.parseUnits(amount, 18);

        this.logger.info(`${this.walletData.name} | L2pass refuel ${this.chain.name} -> ${toChain.name}`);

        let attempts = 0;
        while (attempts < generalConfig.attempts) {
            try {
                const l2passContract = new ethers.Contract(this.l2passContract, l2passAbi, this.walletEthers);
                const { nativeFee } = await l2passContract.estimateGasRefuelFee(toChainId, value, this.walletData.address, false);

                const gasRefuel = await l2passContract['gasRefuel'].populateTransaction(toChainId, '0x0000000000000000000000000000000000000000', value, this.walletData.address);

                let params: any = {
                    from: this.walletData.address,
                    value: nativeFee,
                    gasPrice: undefined
                }

                // if (amount == 0) {
                //     this.logger.error(`${this.walletData.name} : баланс равен 0`);
                //     return;
                // }

                if ([kavaEVM.chainId, MOONBEAM.chainId].includes(toChain.chainId)) {
                    const { gasPrice } = await this.provider.getFeeData();

                    if (gasPrice != null) {
                        params.gasPrice = gasPrice * BigInt(110) / BigInt(100);
                    }
                }

                const tx: ethers.TransactionRequest = {
                    from: this.walletData.address,
                    to: gasRefuel.to,
                    data: gasRefuel.data,
                    value: nativeFee,
                    nonce: await this.provider.getTransactionCount(
                        this.walletData.address,
                        "latest"
                    ),
                    gasLimit: toBeHex(0x100000), // 100000
                    gasPrice: params.gasPrice
                }

                const { gasPrice } = await this.provider.getFeeData();
                if (tx.gasPrice == undefined && gasPrice != null) {
                    tx.maxFeePerGas = gasPrice * BigInt(120) / BigInt(100);
                    tx.maxPriorityFeePerGas = gasPrice * BigInt(110) / BigInt(100);
                }

                const hash = await this.walletEthers.sendTransaction(tx);

                try {
                    await this.provider.waitForTransaction(hash.hash, undefined, 300000);
                } catch (error) {
                    this.logger.error(error);
                }

                let result = await this.provider.getTransactionReceipt(hash.hash);
                if (result?.status == 1) {
                    this.logger.info(`${this.walletData.name} | L2pass Succes refuel ${this.chain.name} -> ${toChain.name}`);
                    break;
                } else {
                    throw new Error("Refuel failed");
                }
            } catch (error) {
                this.logger.error(error);

                attempts++;
                this.logger.error(`${this.walletData.name} | Wait ${generalConfig.attemptsDelay} sec and retry refuel ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                this.provider = new ethers.JsonRpcProvider(this.chain.rpc);
                this.walletEthers = new ethers.Wallet(this.walletData.privateKey, this.provider);

                if (attempts === generalConfig.attempts) { break }
            }
        }
    }
}