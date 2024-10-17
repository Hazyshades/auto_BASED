import { makeLogger } from "../../logger"
import { WalletClient } from "../../utils/walletClient"
import { wallet } from "../../models/wallet"
import { chain } from "../../models/chain"
import { sleep } from "../../utils/common"
import { generalConfig } from "../../../config"
import { token } from "../../models/token"
import axios from "axios"
import { Hex } from "viem"

export class OdosClient {
    walletClient: WalletClient;
    logger: any;
    loggerName: string = "OdosClient";

    zero: Hex = "0x0000000000000000000000000000000000000000";

    constructor(walletData: wallet, chain: chain, logger?: string) {
        this.loggerName = logger ? `${logger} | ${this.loggerName}` : this.loggerName;
        this.logger = makeLogger(this.loggerName);

        this.walletClient = new WalletClient(walletData, chain, logger);
    }

    async swap(from: token, to: token, amount: bigint) {
        this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Swap  ${amount} ${from.name} -> ${to.name}`);

        let attempts = 0;
        while (attempts < generalConfig.attempts) {
            try {
                const pathId = (await this.getQuote(from, to, amount)).pathId;
                const transactionData = (await this.assembleTransaction(pathId)).transaction;
                const contractAddress = transactionData.to;

                if (from.name != this.walletClient.chain.token) {
                    await this.walletClient.approve(contractAddress, from, amount);
                }

                const tx = await this.walletClient.prepareTransaction();
                tx.to = transactionData.to;
                tx.data = transactionData.data;
                tx.value = transactionData.value;

                const res = await this.walletClient.sendTransactionOnce(tx);
                if (res?.status == 1) {
                    this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Success swap ${this.walletClient.chain.scan}/${res?.hash}`);
                    break;
                } else {
                    throw new Error("Swap failed");
                }
            } catch (error) {
                this.logger.error(error);

                attempts++;
                this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Wait ${generalConfig.attemptsDelay} sec and retry swap ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                if (attempts === generalConfig.attempts) {
                    throw new Error(error);
                }
            }
        }
    }

    private async getQuote(from: token, to: token, amount: bigint) {

        const request = {
            chainId: this.walletClient.chain.chainId,
            inputTokens: [
                {
                    tokenAddress: from.name == "ETH" ? this.zero : from.address[this.walletClient.chain.name],
                    amount: amount.toString()
                }
            ],
            outputTokens: [
                {
                    tokenAddress: to.name == "ETH" ? this.zero : to.address[this.walletClient.chain.name],
                    proportion: 1
                }
            ],
            referralCode: 0,
            slippageLimitPercent: 0.3,
            userAddr: this.walletClient.walletAddress,
            compact: true
        };

        return (await axios.post("https://api.odos.xyz/sor/quote/v2", request, {
            headers: {
                'Content-Type': 'application/json;'
            }
        })).data;
    }

    private async assembleTransaction(pathId: any) {

        const request = {
            "userAddr": this.walletClient.walletAddress,
            "pathId": pathId,
            "simulate": false,
        }

        return (await axios.post("https://api.odos.xyz/sor/assemble", request)).data;
    }
}