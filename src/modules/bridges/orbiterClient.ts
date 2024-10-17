import { makeLogger } from "../../logger"
import { WalletClient } from "../../utils/walletClient"
import { wallet } from "../../models/wallet"
import { chain } from "../../models/chain"
import { sleep } from "../../utils/common"
import { generalConfig } from "../../../config"
import { formatEther, parseEther } from "ethers"
import axios from "axios"
import { HttpsProxyAgent } from "https-proxy-agent"

export class OrbiterClient {
    walletClient: WalletClient;
    logger: any;
    loggerName: string = "OrbiterClient";

    OrbiterContract: any = {
        'scroll': '0x80c67432656d59144ceff962e8faf8926599bcf8',
        'base': '0x80c67432656d59144ceff962e8faf8926599bcf8',
        'zksync': '0x80c67432656d59144ceff962e8faf8926599bcf8',
        'linea': '0x80c67432656d59144ceff962e8faf8926599bcf8',
        'optimism': '0x80c67432656d59144ceff962e8faf8926599bcf8'
    }

    Fee: any = {
        'scroll': 25n,
        'base': 13n,
        'zksync': 13n,
        'linea': 40n,
        'optimism': 15n,
    }

    constructor(walletData: wallet, chain: chain, logger?: string) {
        this.loggerName = logger ? `${logger} | ${this.loggerName}` : this.loggerName;
        this.logger = makeLogger(this.loggerName);

        this.walletClient = new WalletClient(walletData, chain, logger);
    }

    async bridge(to: chain, amount?: bigint) {
        this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Bridge ${this.walletClient.chain.name} -> ${to.name}`);

        let attempts = 0;
        let tx;
        let bridgeAmount;
        while (attempts < generalConfig.attempts) {
            try {
                if (amount == undefined) {
                    amount = await this.getMaxAmount(this.walletClient.chain, to);
                }
                bridgeAmount = await this.getBridgeAmount(this.walletClient.chain, to, amount);

                tx = await this.walletClient.prepareTransaction(bridgeAmount);
                tx.to = this.OrbiterContract[this.walletClient.chain.name];

                const res = await this.walletClient.sendTransactionOnce(tx);
                if (res?.status == 1) {
                    this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Success bridge ${bridgeAmount} ETH ${this.walletClient.chain.name} -> ${to.name} ${this.walletClient.chain.scan}/${res?.hash}`);
                } else {
                    throw new Error("Failed Orbiter bridge");
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

        const request = {
            id: 1,
            jsonrpc: "2.0",
            method: "orbiter_getTradingPairs",
            params: []
        }

        const data = (await axios.post("https://openapi.orbiter.finance/explore/v3/yj6toqvwh1177e1sexfy0u1pxx5j8o47", request, {
            httpAgent: this.walletClient.walletData.proxy ? new HttpsProxyAgent(this.walletClient.walletData.proxy) : undefined,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })).data;

        if (data?.result?.ruleList == undefined) {
            throw new Error(data?.result?.error);
        }

        const rule = data.result.ruleList.find((x: any) => x.pairId == `${from.chainId}-${to.chainId}:ETH-ETH`);
        if (rule == undefined) {
            throw new Error("Orbiter rule bridge is undefined");
        }

        const tradingFee = parseEther(rule.tradingFee) * this.Fee[from.name] / 10n;

        const balance = await this.walletClient.balanceOf();
        const { gasPrice, maxFeePerGas } = await this.walletClient.provider.getFeeData();
        const chainFeePerGas = maxFeePerGas ?? gasPrice;

        if (chainFeePerGas == null) {
            throw new Error("Chain fee is undefined");
        }

        const maxAmount = balance - tradingFee - chainFeePerGas * 21000n;
        return maxAmount;
    }

    private async getBridgeAmount(from: chain, to: chain, amount: bigint) {
        const request = {
            "id": 1,
            "jsonrpc": "2.0",
            "method": "orbiter_calculatedAmount",
            "params": [`${from.chainId}-${to.chainId}:ETH-ETH`, formatEther(amount)]
        };

        const data = (await axios.post("https://openapi.orbiter.finance/explore/v3/yj6toqvwh1177e1sexfy0u1pxx5j8o47", request, {
            httpAgent: this.walletClient.walletData.proxy ? new HttpsProxyAgent(this.walletClient.walletData.proxy) : undefined,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })).data;

        if (data?.result?._sendValue == undefined) {
            throw new Error(data?.result?.error);
        }

        return data.result._sendValue;
    }
}