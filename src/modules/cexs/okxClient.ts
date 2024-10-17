import { wallet } from "../../models/wallet";
import { OKXAuth, generalConfig } from "../../../config";
import ccxt from "ccxt";
import { token } from "../../models/token";
import { sleep } from "../../helpers";
import { WalletClient } from "../../utils/walletClient";
import { chain } from "../../models/chain";
import { makeLogger } from "../../logger";
import { ETHEREUM } from "../../data/chains";

export class OkxClient {
    walletData: wallet;
    walletClient: WalletClient;
    okxAuth: OKXAuth;
    chain: chain | undefined;
    logger: any;

    Fee: any = {
        'polygon': 100n,
        'scroll': 1n,
        'base': 26n,
        'zksync': 1n,
        'linea': 1n,
        'optimism': 1000n,
    }

    constructor(wallet: wallet, chain?: chain, logger?: string) {
        this.walletData = wallet;
        this.chain = chain;
        this.walletClient = new WalletClient(wallet, chain ?? ETHEREUM, 'okx');
        this.okxAuth = OKXAuth;

        this.logger = makeLogger(logger ? `${logger} | OkxClient` : "OkxClient");
    }

    async FromOkxToWallet(token: token, amount: any) {
        let attempts = 0;

        if (this.chain == undefined) {
            throw new Error("Chain is undefined");
        }

        while (attempts < generalConfig.attempts) {
            try {
                const handleCcxtError = (e: any) => {
                    const errorType = e.constructor.name;
                    this.logger.error(`An error occurred ${errorType}.`);
                    this.logger.error(`Error details ${e}.`);
                };

                const exchange_options = {
                    'apiKey': OKXAuth.okx_apiKey,
                    'secret': OKXAuth.okx_apiSecret,
                    'password': OKXAuth.okx_apiPassword,
                    'enableRateLimit': true,
                };

                const exchange = new ccxt.okx(exchange_options);
                exchange.https_proxy = OKXAuth.okx_proxy;

                let withdrawFee;
                try {
                    const fees = await exchange.fetchDepositWithdrawFees([token.name]);
                    const feeInfo = (fees as any)[token.name].networks[this.chain.network];
                    if (feeInfo) {
                        withdrawFee = feeInfo.withdraw.fee;
                    } else {
                        withdrawFee = Math.random() * (0.0002 - 0.0001) + 0.0002;
                    }
                } catch (error) {
                    handleCcxtError(error);
                    withdrawFee = Math.random() * (0.0002 - 0.0001) + 0.0002;
                }

                this.logger.info(`${this.walletData.name} | Start withdrawal ${amount} ${token.name} to ${this.chain.name}`)
                const chainName = `${token.name} ${this.chain.name}`;
                let balanceCache = await this.walletClient.balanceOf(token);
                await exchange.withdraw(token.name, amount, this.walletData.address, {
                    toAddress: this.walletData.address,
                    chainName: chainName,
                    dest: 4,
                    fee: withdrawFee,
                    pwd: '-',
                    amt: amount,
                    network: this.chain.network
                });

                this.logger.info(`${this.walletData.name} | Start waiting for deposit 120 seconds....`);
                await sleep(120);
                await this.waitForUpdateBalance(balanceCache, token);
                break;

            } catch (error) {
                this.logger.error(error);

                attempts++;
                this.logger.info(`${this.walletData.name} | Wait 300 sec and retry okx withdraw ${attempts}/${generalConfig.attempts}`);
                await sleep(300);

                if (attempts === generalConfig.attempts) {
                    throw new Error(error);
                }
            }
        }
    }

    async FromWalletErc20ToOkx(token: token, amount: bigint) {

        if (this.chain == undefined) {
            throw new Error("Chain is undefined");
        }

        await this.walletClient.transferErc20Token(token, amount, this.walletData.okx);
        this.logger.info(`${this.walletData.name} | Deposit ${Number(amount)} ${token.name} to OKX`);
    }

    async FromWalletNativeToOkx(amount: bigint): Promise<boolean> {

        if (this.chain == undefined) {
            throw new Error("Chain is undefined");
        }

        const balance = await this.walletClient.balanceOf();
        const { gasPrice, maxFeePerGas } = await this.walletClient.provider.getFeeData();
        const chainFeePerGas = maxFeePerGas ?? gasPrice;

        if (chainFeePerGas == null) {
            throw new Error("Chain fee is undefined");
        }

        const maxAmount = balance - chainFeePerGas * 21000n * this.Fee[this.chain.name];

        if (maxAmount < amount) {
            amount = maxAmount;
        }

        const res = await this.walletClient.transferNativeToken(amount, this.walletData.okx);

        if (res) {
            this.logger.info(`${this.walletData.name} | ${this.chain.name} | Deposit ${Number(amount)} to OKX`);
            return true;
        } else {
            return false;
        }
    }

    async waitForUpdateBalance(balanceCash: any, token: token) {
        if (this.chain == undefined) {
            throw new Error("Chain is undefined");
        }

        try {
            while (true) {
                await new Promise(resolve => setTimeout(resolve, 120 * 1000));
                let balanceNew = await this.walletClient.balanceOf(token);

                if (balanceNew > balanceCash) {
                    console.log(`${this.walletData.name} | Deposit confirmed on wallet`);
                    return;
                }
                else {
                    console.log(`${this.walletData.name} | Deposit not confirmed on wallet yet, waiting 20sec...`);
                }
            }
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    };

    static async tranfserFromSubToMain(wallet: wallet, token: token, loggerName?: any) {
        const logger = makeLogger(loggerName ? `${loggerName} | OkxClient` : "OkxClient");

        if (wallet.subId == undefined || wallet.subId == '') {
            logger.info(`${wallet.name} | It's main account on OKX`);
            return;
        }

        let attempts = 0;

        while (attempts < generalConfig.attempts) {
            try {
                const exchange_options = {
                    'apiKey': OKXAuth.okx_apiKey,
                    'secret': OKXAuth.okx_apiSecret,
                    'password': OKXAuth.okx_apiPassword,
                    'enableRateLimit': true,
                };
        
                const exchange = new ccxt.okx(exchange_options);
                exchange.https_proxy = OKXAuth.okx_proxy;

                const balance_options = {
                    'ccy': token.name,
                    'subAcct': wallet.subId
                }
                const balances = (await exchange.privateGetAssetSubaccountBalances(balance_options)).data;

                let balance;
                if (Array.isArray(balances)) {
                    const tokenBalance = balances.find(x => x.ccy == token.name);
                    balance = tokenBalance.bal;
                } else {
                    balance = balances.bal;
                }

                const transfer_options = {
                    'type': '2',
                    'subAcct': wallet.subId
                }
                await exchange.transfer(token.name, balance, "6", "6", transfer_options);

                logger.info(`${wallet.name} | Start waiting for okx transfer 120 seconds....`);
                await sleep(120);

                logger.info(`${wallet.name} | Transfer ${balance} ${token.name} from ${wallet.subId} to Main`);
                break;
            } catch (error) {
                logger.error(error);

                attempts++;
                logger.info(`${wallet.name} | Wait 1200 sec and retry transfer sub -> main ${attempts}/${generalConfig.attempts}`);
                await sleep(1200);

                if (attempts === generalConfig.attempts) {
                    throw new Error(error);
                }
            }
        }
    }
}