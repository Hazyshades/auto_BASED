import { ethers } from "ethers";
import { generalConfig } from "../../../config";
import { makeLogger } from "../../logger";
import { chain } from "../../models/chain";
import { wallet } from "../../models/wallet";
import { WalletClient } from "../../utils/walletClient";
import { rubyScoreAbi } from "../../abi/rubyScoreAbi";
import { sleep } from "../../utils/common";


export class RubyScoreClient {
    walletData: wallet;
    walletClient: WalletClient;
    chain: chain;
    paramDomain: any;
    logger: any;
    loggerName: string = "RubyScoreClient";

    RubyScoreContract: any = {
        'scroll': '0xe10Add2ad591A7AC3CA46788a06290De017b9fB4',
        'base': '0xe10Add2ad591A7AC3CA46788a06290De017b9fB4',
        'zkSync': '0xcb84d512f0c9943d3bc6b4be8801ac8aa6621a54',
        'linea': '0xe10Add2ad591A7AC3CA46788a06290De017b9fB4'
    }

    constructor(walletData: wallet, chain: chain, logger?: string) {
        this.walletData = walletData;
        this.chain = chain;

        this.loggerName = logger ? `${logger} | ${this.loggerName}` : this.loggerName;
        this.logger = makeLogger(this.loggerName);

        this.walletClient = new WalletClient(walletData, chain, logger);
    }

    async use() {
        this.logger.info(`${this.walletData.name} | ${this.walletClient.chain.name} | Vote`);

        let attempts = 0;
        while (attempts < generalConfig.attempts) {
            try {
                const rubyScoreContract = new ethers.Contract(this.RubyScoreContract[this.chain.name], rubyScoreAbi, this.walletClient.walletEthers);
                const vote = await rubyScoreContract['vote'].populateTransaction();

                const tx = await this.walletClient.prepareTransaction();
                tx.to = vote.to;
                tx.data = vote.data;

                const res = await this.walletClient.sendTransactionOnce(tx);
                if (res?.status == 1) {
                    this.logger.info(`${this.walletData.name} | ${this.walletClient.chain.name} | Success Vote ${this.chain.scan}/${res?.hash}`);
                    break;
                } else {
                    throw new Error("Vote failed");
                }
            } catch (error) {
                this.logger.error(error);

                attempts++;
                this.logger.info(`${this.walletData.name} | ${this.walletClient.chain.name} | Wait ${generalConfig.attemptsDelay} sec and retry Vote ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                if (attempts === generalConfig.attempts) {
                    throw new Error(error);
                }
            }
        }
    }
}