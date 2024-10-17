import { ethers, formatEther } from "ethers";
import { generalConfig } from "../../../config";
import { makeLogger } from "../../logger";
import { chain } from "../../models/chain";
import { wallet } from "../../models/wallet";
import { WalletClient } from "../../utils/walletClient";
import { sleep } from "../../utils/common";
import { moonWellAbi } from "../../abi/moonWellAbi";
import { erc20Abi } from "../../abi/erc20abi";


export class MoonWellClient {
    walletData: wallet;
    walletClient: WalletClient;
    chain: chain;
    paramDomain: any;
    logger: any;
    loggerName: string = "MoonWellClient";

    MoonWellContracts: any = {
        'base': {
            'landing': '0x70778cfcFC475c7eA0f24cC625Baf6EaE475D0c9',
            'pool': '0x628ff693426583D9a7FB391E54366292F509D457'
        }
    }

    constructor(walletData: wallet, chain: chain, logger?: string) {
        this.walletData = walletData;
        this.chain = chain;

        this.loggerName = logger ? `${logger} | ${this.loggerName}` : this.loggerName;
        this.logger = makeLogger(this.loggerName);

        this.walletClient = new WalletClient(walletData, chain, logger);
    }

    async deposit(amount?: bigint) {
        this.logger.info(`${this.walletData.name} | ${this.chain.name} | Deposit`);

        let attempts = 0;
        while (attempts < generalConfig.attempts) {
            try {
                if (amount == undefined) {
                    const balance = await this.walletClient.balanceOf();
                    amount = balance * BigInt(90) / BigInt(100);
                }

                const landingContract = new ethers.Contract(this.MoonWellContracts[this.chain.name].landing, moonWellAbi, this.walletClient.walletEthers);
                const deposit = await landingContract.mint.populateTransaction(this.walletData.address);

                const tx = await this.walletClient.prepareTransaction(amount);
                tx.to = deposit.to;
                tx.data = deposit.data;

                const res = await this.walletClient.sendTransactionOnce(tx);
                if (res?.status == 1) {
                    this.logger.info(`${this.walletData.name} | ${this.chain.name} | Success Deposit ${formatEther(amount)} ETH ${this.chain.scan}/${res?.hash}`);
                    break;
                } else {
                    throw new Error("Deposit failed");
                }
            } catch (error) {
                this.logger.error(error);

                attempts++;
                this.logger.info(`${this.walletData.name} | ${this.chain.name} | Wait 300 sec and retry Deposit ${attempts}/${generalConfig.attempts}`);
                await sleep(300);

                if (attempts === generalConfig.attempts) {
                    throw new Error(error);
                }
            }
        }
    }

    async withdraw() {
        this.logger.info(`${this.walletData.name} | Withdraw`);

        let attempts = 0;
        while (attempts < generalConfig.attempts) {
            try {
                const poolContract = new ethers.Contract(this.MoonWellContracts[this.chain.name].pool, erc20Abi, this.walletClient.walletEthers);
                const balance = await poolContract.balanceOf(this.walletClient.walletAddress);

                if (balance == 0) {
                    this.logger.info(`${this.walletData.name} | Insufficient balance on MoonWell!`);
                    break;
                }

                const landingContract = new ethers.Contract(this.MoonWellContracts[this.chain.name].pool, moonWellAbi, this.walletClient.walletEthers);
                const withdraw = await landingContract.redeem.populateTransaction(balance);

                const tx = await this.walletClient.prepareTransaction();
                tx.to = withdraw.to;
                tx.data = withdraw.data;

                const res = await this.walletClient.sendTransactionOnce(tx);
                if (res?.status == 1) {
                    this.logger.info(`${this.walletData.name} | Success Withdraw ${balance} ETH ${this.chain.scan}/${res?.hash}`);
                    break;
                } else {
                    throw Error("Withdraw failed");
                }
            } catch (error) {
                this.logger.error(error);

                attempts++;
                this.logger.info(`${this.walletData.name} | Wait ${generalConfig.attemptsDelay} sec and retry Withdraw ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                if (attempts === generalConfig.attempts) {
                    throw new Error(error);
                }
            }
        }
    }
}