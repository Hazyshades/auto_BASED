import { ethers, formatEther } from "ethers";
import { generalConfig } from "../../../config";
import { makeLogger } from "../../logger";
import { chain } from "../../models/chain";
import { wallet } from "../../models/wallet";
import { WalletClient } from "../../utils/walletClient";
import { sleep } from "../../utils/common";
import { landing_aaveAbi } from "../../abi/aaveAbi";
import { erc20Abi } from "../../abi/erc20abi";
import { abasweth } from "../../data/tokens";


export class AaveClient {
    walletData: wallet;
    walletClient: WalletClient;
    chain: chain;
    paramDomain: any;
    logger: any;
    loggerName: string = "AaveClient";

    AaveAddress: string = "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5";
    AaveContracts: any = {
        'base': {
            'landing': '0x18cd499e3d7ed42feba981ac9236a278e4cdc2ee',
            'pool': '0xD4a0e0b9149BCee3C920d2E00b5dE09138fd8bb7'
        },
        'scroll': {
            'landing': '0xff75a4b698e3ec95e608ac0f22a03b8368e05f5d',
            'pool': '0xf301805be1df81102c957f6d4ce29d2b8c056b2a'
        }
    }

    constructor(walletData: wallet, chain: chain, logger?: string) {
        this.walletData = walletData;
        this.chain = chain;

        this.loggerName = logger ? `${logger} | ${this.loggerName}` : this.loggerName;
        this.logger = makeLogger(this.loggerName);

        this.walletClient = new WalletClient(walletData, chain, logger);
    }

    async deposit(amount: bigint) {
        this.logger.info(`${this.walletData.name} | ${this.chain.name} | Deposit ${formatEther(amount)} ETH`);

        let attempts = 0;
        while (attempts < generalConfig.attempts) {
            try {

                const landingContract = new ethers.Contract(this.AaveContracts[this.chain.name].landing, landing_aaveAbi, this.walletClient.walletEthers);
                const deposit = await landingContract.depositETH.populateTransaction(this.AaveAddress, this.walletData.address, 0);

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
                const poolContract = new ethers.Contract(this.AaveContracts[this.chain.name].pool, erc20Abi, this.walletClient.walletEthers);
                const balance = await poolContract.balanceOf(this.walletClient.walletAddress);

                if (balance == 0) {
                    this.logger.info(`${this.walletData.name} | Insufficient balance on Aave!`);
                    break;
                }

                await this.walletClient.approve(this.AaveContracts[this.chain.name].landing, abasweth, balance);

                const landingContract = new ethers.Contract(this.AaveContracts[this.chain.name].landing, landing_aaveAbi, this.walletClient.walletEthers);
                const withdraw = await landingContract.withdrawETH.populateTransaction(this.AaveAddress, balance, this.walletData.address);


                const tx = await this.walletClient.prepareTransaction();
                tx.to = withdraw.to;
                tx.data = withdraw.data;

                const res = await this.walletClient.sendTransactionOnce(tx);
                if (res?.status == 1) {
                    this.logger.info(`${this.walletData.name} | Success Withdraw ${formatEther(balance)} ETH ${this.chain.scan}/${res?.hash}`);
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