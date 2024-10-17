import { makeLogger } from "../../logger"
import { WalletClient } from "../../utils/walletClient"
import { wallet } from "../../models/wallet"
import { chain } from "../../models/chain"
import { sleep } from "../../utils/common"
import { generalConfig } from "../../../config"
import { formatEther, parseEther, parseUnits } from "ethers"
import axios from "axios"
import { token } from "../../models/token"
import { eth } from "../../data/tokens"

export class OwltoClient {
    walletClient: WalletClient;
    logger: any;
    loggerName: string = "OwltoClient";

    OwltoContract: any = {
        "scroll": "",
        "base": "",
        "zkSync": ""
    }

    Fee: any = {
        "optimism": 10n,
        "scroll": 11n,
        "base": 11n,
        "linea": 21n,
        "zkSync": ""
    }

    constructor(walletData: wallet, chain: chain, logger?: string) {
        this.loggerName = logger ? `${logger} | ${this.loggerName}` : this.loggerName;
        this.logger = makeLogger(this.loggerName);

        this.walletClient = new WalletClient(walletData, chain, logger);
    }

    async bridge(to: chain, amount?: bigint) {
        this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Bridge ${amount ? formatEther(amount) : NaN} ${eth.name}`);

        let attempts = 0;
        while (attempts < generalConfig.attempts) {
            try {
                const { toInfo } = await this.getChainsInfo(this.walletClient.chain, to);
                const { maker_address } = await this.getLpConfig(to, eth);

                if (amount == undefined) {
                    amount = await this.getMaxAmount(this.walletClient.chain, to);
                }
                const destinationCode = parseInt(toInfo.networkCode);
                const fullAmount = (amount - amount % 10000n) + BigInt(destinationCode);

                const destinationWallet = new WalletClient(this.walletClient.walletData, to, this.loggerName);
                const oldDestinationBalance = await destinationWallet.balanceOf();

                await this.walletClient.transfer(eth, fullAmount, maker_address);
                this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Wait 100 seconds`);
                await sleep(100);

                let newDestinationBalance: bigint = 0n;
                while (true) {
                    newDestinationBalance = await destinationWallet.balanceOf();

                    if (newDestinationBalance > oldDestinationBalance) {
                        break;
                    }

                    this.logger.info(`${this.walletClient.walletData.name} | ${to.name} | Still waiting 100 seconds`);
                    await sleep(100);
                }
                this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Success bridge ${fullAmount} ETH ${this.walletClient.chain.name} -> ${to.name}`);

                break;
            } catch (error) {
                this.logger.error(error);

                attempts++;
                this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Wait ${generalConfig.attemptsDelay} sec and retry Owlto Bridge ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                if (attempts === generalConfig.attempts) {
                    throw new Error(error);
                }
            }
        }
    }

    private async getChainsInfo(from: chain, to: chain) {
        const bridgeConfig = (await axios.get("https://owlto.finance/api/config/all-chains")).data?.msg;
        const fromInfo = bridgeConfig.find((x: any) => x.chainId == from.chainId);
        const toInfo = bridgeConfig.find((x: any) => x.chainId == to.chainId);
        return { fromInfo, toInfo };
    }

    private async getLpConfig(to: chain, token: token) {

        const params = {
            'token': token.name,
            'from_chainid': this.walletClient.chain.chainId,
            'to_chainid': to.chainId,
            'user': this.walletClient.walletAddress
        }

        const lpConfig = (await axios.get("https://owlto.finance/api/lp-info", { params })).data?.msg;

        const maker_address = lpConfig.maker_address;
        const from_token_address = lpConfig.from_token_address;
        const to_token_address = lpConfig.to_token_address;
        const bridge_address = lpConfig.bridge_contract_address;
        const decimals = lpConfig.token_decimal;
        const min_amount_in_wei = lpConfig.min;
        const max_amount_in_wei = lpConfig.max;
        const min_amount = parseUnits(min_amount_in_wei, decimals);
        const max_amount = parseUnits(max_amount_in_wei, decimals);

        return { maker_address, min_amount, max_amount, decimals, bridge_address, from_token_address, to_token_address };
    }

    private async getTxFee(from: string, to: string, amount: bigint, token: token) {
        const params = {
            'from': from,
            'to': to,
            'amount': amount,
            'token': token.name
        }

        return (await axios.get("https://owlto.finance/api/dynamic-dtc", { params })).data?.msg;
    }

    private async getMaxAmount(from: chain, to: chain) {
        const { fromInfo, toInfo } = await this.getChainsInfo(from, to);

        const balance = await this.walletClient.balanceOf();

        const fee = await this.getTxFee(fromInfo.name, toInfo.name, balance, eth);
        const tradingFee = parseEther(fee);

        this.logger.info(`${this.walletClient.walletData.name} | ${from.name} | Bridge fee ${fee} ETH`);

        const { gasPrice, maxFeePerGas } = await this.walletClient.provider.getFeeData();
        const estimateGas = maxFeePerGas ?? gasPrice;

        if (estimateGas == null) {
            throw Error("EstimateGas is null");
        }

        const maxAmount = balance - tradingFee * this.Fee[from.name] / 10n - estimateGas * 21000n;
        return maxAmount;
    }
}