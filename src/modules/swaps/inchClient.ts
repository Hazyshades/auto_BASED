import { generalConfig } from "../../../config";
import { token } from "../../models/token";
import { InchV5Swap } from "../../api/1inchApi";
import { makeLogger } from "../../logger";
import { chain } from "../../models/chain";
import { wallet } from "../../models/wallet";
import { sleep } from "../../utils/common";
import { WalletClient } from "../../utils/walletClient";

export class InchClient {
    walletData: wallet;
    walletClient: WalletClient;
    chain: chain;
    logger: any;

    inchToken: string = "126wyzYrRS3ijXvyxqHEnreqwnJxUHHD";
    inch: any;

    constructor(wallet: wallet, chain: chain, logger?: string) {
        this.walletData = wallet;
        this.chain = chain;
        this.walletClient = new WalletClient(wallet, chain, logger);

        this.logger = makeLogger(logger ? `${logger} | InchClient` : "InchClient");
    }

    async swap(from: token, to: token, amount: bigint) {
        this.logger.info(`${this.walletData.name} | 1inch swap ${Number(amount)} ${from.name} -> ${to.name}`);

        let attempts = 0;
        let quote: any;

        while (attempts < generalConfig.attempts) {
            try 
            {
                this.inch = new InchV5Swap(this.chain.chainId, this.inchToken);
                const tx = await this.inch.approveTransaction(from.address[this.chain.name], amount.toString());
                await this.walletClient.sendTransaction(tx);
                
                quote = await this.inch.swap(from.address[this.chain.name], to.address[this.chain.name], amount.toString(), this.walletData.address, 1);
                await this.walletClient.sendTransactionOnce(quote.tx);
                this.logger.info(`${this.walletData.name} | 1inch success swap ${Number(amount)} ${from.name} -> ${to.name}`);
                break;
            } catch (error) {
                this.logger.error(quote);

                attempts++;
                this.logger.info(`${this.walletData.name} | Wait ${generalConfig.attemptsDelay} sec and retry 1inch swap ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                if (attempts === generalConfig.attempts) {
                    throw new Error(error);
                }
            }
        }
    }
}