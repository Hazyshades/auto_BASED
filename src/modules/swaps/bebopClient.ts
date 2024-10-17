import { Hex, formatEther } from "viem"
import axios from "axios"
import { makeLogger } from "../../logger"
import { token } from "../../models/token"
import { WalletClient } from "../../utils/walletClient"
import { wallet } from "../../models/wallet"
import { chain } from "../../models/chain"
import { sleep } from "../../utils/common"
import { generalConfig } from "../../../config"
import { HttpsProxyAgent } from "https-proxy-agent"
import { JAM_PARAM_TYPES } from "../../types/bebopTypes"

export class BebopClient {
    walletData: wallet;
    wallet: WalletClient;
    chain: chain;
    paramDomain: any;
    logger: any;
    loggerName: string = "BebopClient";

    RFQcontract: Hex = '0xBeB09000fa59627dc02Bb55448AC1893EAa501A5';
    JAMcontract: Hex = '0xbEbEbEb035351f58602E0C1C8B59ECBfF5d5f47b';
    JAMbalanceManager: Hex = '0xfE96910cF84318d1B8a5e2a6962774711467C0be';

    constructor(walletData: wallet, chain: chain, logger?: string) {
        this.walletData = walletData;
        this.chain = chain;

        this.paramDomain = {
            name: "JamSettlement",
            version: "1",
            chainId: chain.chainId,
            verifyingContract: this.JAMcontract,
        }

        this.loggerName = logger ? `${logger} | ${this.loggerName}` : this.loggerName;
        this.logger = makeLogger(this.loggerName);
        this.wallet = new WalletClient(this.walletData, this.chain, this.loggerName);
    }

    async swapOneToMany(sellToken: token, sellAmount: bigint, buyTokens: token[], ratio: number[]) {
        this.logger.info(`${this.walletData.name} | Swap OneToMany ${Number(sellAmount)} ${sellToken.name} -> ${buyTokens.map(x => x.name).join(', ')}`);
        await this.RFQswap([sellToken], [sellAmount], buyTokens, ratio);
    }

    async swapManyToOne(sellTokens: token[], sellAmounts: bigint[], buyToken: token) {
        this.logger.info(`${this.walletData.name} | Swap ManyToOne ${sellAmounts.map(x => formatEther(x)).join(', ')} ${sellTokens.map(x => x.name).join(', ')} -> ${buyToken.name}`);
        await this.RFQswap(sellTokens, sellAmounts, [buyToken]);
    }

    async RFQswap(from: token[], amount: bigint[], to: token[], ratio?: number[]) {
        this.logger.info(`${this.walletData.name} | RFQ Swap ${amount.map(x => formatEther(x)).join(', ')} ${from.map(x => x.name).join(', ')} -> ${to.map(x => x.name).join(', ')}`);

        let attempts = 0;
        let quote;

        while (attempts < generalConfig.attempts) {
            try {
                await this.wallet.approve(this.RFQcontract, from, amount);

                quote = (await axios.get(`https://api.bebop.xyz/${this.chain.name}/v2/quote`, {
                    httpAgent: this.walletData.proxy ? new HttpsProxyAgent(this.walletData.proxy) : undefined,
                    params: {
                        sell_tokens: from.map(x => x.address[this.chain.name]).toString(),
                        sell_amounts: amount.map(x => x.toString()).toString(),
                        buy_tokens: to.map(x => x.address[this.chain.name]).toString(),
                        buy_tokens_ratios: ratio ? ratio.toString() : undefined,
                        taker_address: this.walletData.address,
                        gasless: false
                    }
                })).data

                await this.wallet.sendTransactionOnce(quote.tx);
                this.logger.info(`${this.walletData.name} | Succes RFQ Swap ${from.map(x => x.name).join(', ')} -> ${to.map(x => x.name).join(', ')}`);

                break;
            } catch (error) {
                this.logger.error(quote);
                this.logger.error(error);

                attempts++;
                this.logger.info(`${this.walletData.name} | Wait ${generalConfig.attemptsDelay} sec and retry Bebop RFQ swap ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                this.wallet = new WalletClient(this.walletData, this.chain, "BebopClient");

                if (attempts === generalConfig.attempts) {
                    throw new Error(error);
                }
            }
        }
    }

    async jamSwap(from: token[], amount: bigint[], to: token[], ratio?: number[]) {
        this.logger.info(`${this.walletData.name} | JAM Swap ${amount.map(x => formatEther(x)).join(', ')} ${from.map(x => x.name).join(', ')} -> ${to.map(x => x.name).join(', ')}`);

        let attempts = 0;

        let quote;
        let signature;
        let response;

        while (attempts < generalConfig.attempts) {
            try {
                await this.wallet.approve(this.JAMbalanceManager, from, amount);

                quote = (await axios.get(`https://api.bebop.xyz/jam/${this.chain.name}/v1/quote`, {
                    httpAgent: this.walletData.proxy ? new HttpsProxyAgent(this.walletData.proxy) : undefined,
                    params: {
                        sell_tokens: from.map(x => x.address[this.chain.name]).toString(),
                        sell_amounts: amount.toString(),
                        buy_tokens: to.map(x => x.address[this.chain.name]).toString(),
                        buy_tokens_ratios: ratio ? ratio.toString() : undefined,
                        taker_address: this.walletData.address
                    }
                })).data

                signature = await this.wallet.signTypedData(this.paramDomain, JAM_PARAM_TYPES, quote.toSign);

                response = (await axios.post(`https://api.bebop.xyz/jam/${this.chain.name}/v1/order`, {
                    signature: signature,
                    quote_id: quote.quoteId,
                }, {
                    httpAgent: this.walletData.proxy ? new HttpsProxyAgent(this.walletData.proxy) : undefined,
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                })).data

                this.logger.info(`${this.walletData.name} | Succes JAM Swap ${from.map(x => x.name).join(', ')} -> ${to.map(x => x.name).join(', ')}`);
                break;
            } catch (error) {
                this.logger.error(quote);
                this.logger.error(signature);
                this.logger.error(response);
                this.logger.error(error);

                attempts++;
                this.logger.info(`${this.walletData.name} | Wait ${generalConfig.attemptsDelay} sec and retry Bebop JAM swap ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                this.wallet = new WalletClient(this.walletData, this.chain, "BebopClient");

                if (attempts === generalConfig.attempts) {
                    throw new Error(error);
                }
            }
        }
    }
}