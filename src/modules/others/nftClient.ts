import { makeLogger } from "../../logger"
import { WalletClient } from "../../utils/walletClient"
import { wallet } from "../../models/wallet"
import { chain } from "../../models/chain"
import { sleep } from "../../utils/common"
import { generalConfig } from "../../../config"
import { ethers, toUtf8Bytes } from "ethers"
import { baseNftAbi } from "../../abi/baseNftAbi"
import { error } from "console"

export class BaseNftClient {
    walletClient: WalletClient;
    logger: any;
    loggerName: string = "BaseNftClient";

    constructor(walletData: wallet, chain: chain, logger?: string) {
        this.loggerName = logger ? `${logger} | ${this.loggerName}` : this.loggerName;
        this.logger = makeLogger(this.loggerName);

        this.walletClient = new WalletClient(walletData, chain, logger);
    }

    async mintCoinEarnings() {
        this.logger.info(`${this.walletClient.walletData.name} | mint COIN Earnings NFT`);

        let attempts = 0;
        while (attempts < generalConfig.attempts) {
            try {
                const nftContract = new ethers.Contract("0x1D6b183bD47F914F9f1d3208EDCF8BefD7F84E63", baseNftAbi, this.walletClient.walletEthers);
                const claim = await nftContract['claim'].populateTransaction(this.walletClient.walletAddress, 0, 1, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', 0, [[], 2, 0, '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'], toUtf8Bytes('0x'));

                const tx = await this.walletClient.prepareTransaction();
                tx.to = claim.to;
                tx.data = claim.data;

                const res = await this.walletClient.sendTransactionOnce(tx);
                if (res?.status == 1) {
                    this.logger.info(`${this.walletClient.walletData.name} | Success mint COIN Earnings NFT ${this.walletClient.chain.scan}/${res?.hash}`);
                    break;
                } else {
                    throw new Error("Failed mint COIN Earnings NFT");
                }
            } catch (error) {
                this.logger.error(error);

                attempts++;
                this.logger.info(`${this.walletClient.walletData.name} | Wait ${generalConfig.attemptsDelay} sec and retry mint COIN Earnings NFT ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                if (attempts === generalConfig.attempts) {
                    throw new Error(error);
                }
            }
        }
    }
}