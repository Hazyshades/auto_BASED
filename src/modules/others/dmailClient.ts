import { sha256 } from "viem"
import { makeLogger } from "../../logger"
import { WalletClient } from "../../utils/walletClient"
import { wallet } from "../../models/wallet"
import { chain } from "../../models/chain"
import { sleep } from "../../utils/common"
import { generalConfig } from "../../../config"
import { ethers } from "ethers"
import { dmailAbi } from "../../abi/dmailAbi"
import { getRandomInt, getRandomItem } from "../../helpers"
import { lorem, sentence } from "txtgen"

export class DmailClient {
    walletClient: WalletClient;
    logger: any;
    loggerName: string = "DmailClient";

    DmailContract: any = {
        'scroll': '0x47fbe95e981C0Df9737B6971B451fB15fdC989d9',
        'base': '0x47fbe95e981c0df9737b6971b451fb15fdc989d9',
        'zkSync': '0x981f198286e40f9979274e0876636e9144b8fb8e'
    }

    constructor(walletData: wallet, chain: chain, logger?: string) {
        this.loggerName = logger ? `${logger} | ${this.loggerName}` : this.loggerName;
        this.logger = makeLogger(this.loggerName);

        this.walletClient = new WalletClient(walletData, chain, logger);
    }


    private generateEmail() {
        return `${lorem(1, 1)}${getRandomInt([1, 999999])}@${getRandomItem(['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'yandex.ru', 'mail.ru'])}`
    }

    private generateSentence() {
        return sentence();
    }

    async use() {
        this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Send mail`);

        let attempts = 0;
        while (attempts < generalConfig.attempts) {
            try {
                const email = this.generateEmail();
                const text = this.generateSentence();

                const to_address = sha256(Buffer.from(email), 'hex');
                const message = sha256(Buffer.from(text), 'hex');

                const dmailContract = new ethers.Contract(this.DmailContract[this.walletClient.chain.name], dmailAbi, this.walletClient.walletEthers);
                const sendMail = await dmailContract['send_mail'].populateTransaction(to_address, message);

                const tx = await this.walletClient.prepareTransaction();
                tx.to = sendMail.to;
                tx.data = sendMail.data;

                const res = await this.walletClient.sendTransactionOnce(tx);
                if (res?.status == 1) {
                    this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Success send mail ${this.walletClient.chain.scan}/${res?.hash}`);
                    break;
                } else {
                    throw new Error("Send mail failed");
                }
            } catch (error) {
                this.logger.error(error);

                attempts++;
                this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Wait ${generalConfig.attemptsDelay} sec and retry Dmail send message ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                if (attempts === generalConfig.attempts) {
                    throw new Error(error);
                }
            }
        }
    }
}