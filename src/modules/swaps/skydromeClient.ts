import { makeLogger } from "../../logger"
import { WalletClient } from "../../utils/walletClient"
import { wallet } from "../../models/wallet"
import { chain } from "../../models/chain"
import { sleep } from "../../utils/common"
import { generalConfig, swapConfig } from "../../../config"
import { token } from "../../models/token"
import { ethers } from "ethers"
import moment from "moment"
import { Hex } from "viem"
import { skydromeAbi } from "../../abi/skydromeAbi"

export class SkydromeClient {
    walletClient: WalletClient;
    logger: any;
    loggerName: string = "SkydromeClient";

    RouterContract: Hex = '0xAA111C62cDEEf205f70E6722D1E22274274ec12F';

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
                const swapTx = from.name == "ETH" ? await this.swapETHtoToken(from, to, amount) : await this.swapTokenToETH(from, to, amount);

                const res = await this.walletClient.sendTransactionOnce(swapTx);
                if (res?.status == 1) {
                    this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Success swap ${this.walletClient.chain.scan}/${res?.hash}`);
                    break;
                } else {
                    throw Error("Swap failed")
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

    private async getAmountOut(from: token, to: token, amount: bigint) {
        const contract = new ethers.Contract(this.RouterContract, skydromeAbi, this.walletClient.walletEthers);
        const minAmountOut = await contract.getAmountOut(amount.toString(), from.address[this.walletClient.chain.name], to.address[this.walletClient.chain.name]);
        return [minAmountOut[0] - (minAmountOut[0] / 100n * BigInt(swapConfig.slippage)), minAmountOut[1]]
    }

    private async swapETHtoToken(from: token, to: token, amount: bigint): Promise<ethers.TransactionRequest> {
        const minAmountOut = await this.getAmountOut(from, to, amount);
        const deadline = moment.now() + 2000000;

        const routerContract = new ethers.Contract(this.RouterContract, skydromeAbi, this.walletClient.walletEthers);
        const swapExactETHForTokens = await routerContract.swapExactETHForTokens.populateTransaction(
            minAmountOut[0],
            [
                [
                    from.address[this.walletClient.chain.name],
                    to.address[this.walletClient.chain.name],
                    minAmountOut[1]
                ]
            ],
            this.walletClient.walletAddress,
            deadline);

        const tx = await this.walletClient.prepareTransaction();

        tx.value = amount;
        tx.data = swapExactETHForTokens.data;
        tx.to = swapExactETHForTokens.to;

        return tx;
    }

    private async swapTokenToETH(from: token, to: token, amount: bigint): Promise<ethers.TransactionRequest> {

        await this.walletClient.approve(this.RouterContract, from, amount * 2n);

        const minAmountOut = await this.getAmountOut(from, to, amount);
        const deadline = Math.floor(Date.now() / 1000) + 2000000;

        const routerContract = new ethers.Contract(this.RouterContract, skydromeAbi, this.walletClient.walletEthers);
        const swapExactETHForTokens = await routerContract.swapExactTokensForETH.populateTransaction(
            amount,
            minAmountOut[0],
            [
                [
                    from.address[this.walletClient.chain.name],
                    to.address[this.walletClient.chain.name],
                    minAmountOut[1]
                ]
            ],
            this.walletClient.walletData.address,
            deadline);
    
        const tx = await this.walletClient.prepareTransaction();

        tx.data = swapExactETHForTokens.data;
        tx.to = swapExactETHForTokens.to;

        return tx;
    }
}