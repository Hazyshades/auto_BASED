import { makeLogger } from "../../logger"
import { WalletClient } from "../../utils/walletClient"
import { wallet } from "../../models/wallet"
import { chain } from "../../models/chain"
import { sleep } from "../../utils/common"
import { generalConfig } from "../../../config"
import axios from "axios"
import { HttpsProxyAgent } from "https-proxy-agent"
import { token } from "../../models/token"
import Web3 from "web3"
import { Hex } from "viem"
import { eth } from "../../data/tokens"

export class NitroClient {
    walletClient: WalletClient;
    logger: any;
    loggerName: string = "NitroClient";

    Fee: any = {
        'scroll': 12n,
        'base': 1n,
        'zksync': 1n,
        'linea': 1n,
        'optimism': 1n,
    }

    eth_mask: Hex = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

    constructor(walletData: wallet, chain: chain, logger?: string) {
        this.loggerName = logger ? `${logger} | ${this.loggerName}` : this.loggerName;
        this.logger = makeLogger(this.loggerName);

        this.walletClient = new WalletClient(walletData, chain, logger);
    }

    async bridge(to: chain, amount?: bigint) {
        this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Bridge ${this.walletClient.chain.name} -> ${to.name}`);

        let attempts = 0;
        while (attempts < generalConfig.attempts) {
            try {
                if (amount == undefined) {
                    amount = await this.getMaxAmount(this.walletClient.chain, to);
                }
                const quote = await this.getQuote(this.walletClient.chain, to, eth, amount);
                const txData = await this.buildTx(quote);

                const tx = await this.walletClient.prepareTransaction(amount);
                tx.to = txData[1];
                tx.data = txData[0];

                const res = await this.walletClient.sendTransactionOnce(tx);
                if (res?.status == 1) {
                    this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Success bridge ${amount} ETH ${this.walletClient.chain.name} -> ${to.name} ${this.walletClient.chain.scan}/${res?.hash}`);
                } else {
                    throw new Error("Failed bridge");
                }

                break;
            } catch (error) {
                this.logger.error(error);

                attempts++;
                this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Wait ${generalConfig.attemptsDelay} sec and retry bridge ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                if (attempts === generalConfig.attempts) {
                    throw new Error(error);
                }
            }
        }
    }

    private async getMaxAmount(from: chain, to: chain) {
        const balance = await this.walletClient.balanceOf();
        const quote = await this.getQuote(from, to, eth, balance);
        const fee = BigInt(quote.bridgeFee.amount);
        return balance - 12n * fee;
    }

    private async buildTx(quote: any) {
        const url = "https://api-beta.pathfinder.routerprotocol.com/api/v2/transaction";

        quote.receiverAddress = quote.receiverAddress ?? this.walletClient.walletAddress;
        quote.senderAddress = quote.senderAddress ?? this.walletClient.walletAddress;

        const response = (await axios.post(url, quote, {
            httpAgent: this.walletClient.walletData.proxy ? new HttpsProxyAgent(this.walletClient.walletData.proxy) : undefined,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })).data

        return [response['txn']['data'], Web3.utils.toChecksumAddress(response['txn']['to'])]
    }

    private async getQuote(from: chain, to: chain, token: token, amount: bigint) {
        const url = "https://api-beta.pathfinder.routerprotocol.com/api/v2/quote"

        const params = {
            "fromTokenAddress": token.name == "ETH" ? this.eth_mask : token.address[from.name],
            "toTokenAddress": token.name == "ETH" ? this.eth_mask : token.address[from.name],
            "amount": amount,
            "fromTokenChainId": from.chainId,
            "toTokenChainId": to.chainId,
            "partnerId": 1
        }

        const data = (await axios.get(url, {
            params: params,
            httpAgent: this.walletClient.walletData.proxy ? new HttpsProxyAgent(this.walletClient.walletData.proxy) : undefined,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })).data;

        return data;
    }
}