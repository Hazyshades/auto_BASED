import { ethers, formatEther } from "ethers";
import { generalConfig } from "../../../config";
import { makeLogger } from "../../logger";
import { chain } from "../../models/chain";
import { wallet } from "../../models/wallet";
import { WalletClient } from "../../utils/walletClient";
import { landing_layerBankAbi, pool_layerBankAbi } from "../../abi/layerBankAbi";
import { sleep } from "../../utils/common";


export class LayerBankClient {
    walletData: wallet;
    walletClient: WalletClient;
    chain: chain;
    paramDomain: any;
    logger: any;
    loggerName: string = "LayerBankClient";

    LayerBankContracts: any = {
        'linea': {
            'landing': '0x009a0b7C38B542208936F1179151CD08E2943833',
            'pool': '0xc7D8489DaE3D2EbEF075b1dB2257E2c231C9D231'
        },
        'scroll': {
            'landing': '0xEC53c830f4444a8A56455c6836b5D2aA794289Aa',
            'pool': '0x274C3795dadfEbf562932992bF241ae087e0a98C'
        }
    }

    constructor(walletData: wallet, chain: chain, logger?: string) {
        this.walletData = walletData;
        this.chain = chain;

        this.loggerName = logger ? `${logger} | ${this.loggerName}` : this.loggerName;
        this.logger = makeLogger(this.loggerName);

        this.walletClient = new WalletClient(walletData, chain, logger);
    }

    async deposit() {
        this.logger.info(`${this.walletData.name} | ${this.chain.name} | Deposit`);

        let attempts = 0;
        while (attempts < generalConfig.attempts) {
            try {
                const balance = await this.walletClient.balanceOf();
                const amount = balance * BigInt(90) / BigInt(100);

                const landingContract = new ethers.Contract(this.LayerBankContracts[this.chain.name].landing, landing_layerBankAbi, this.walletClient.walletEthers);
                const supply = await landingContract['supply'].populateTransaction(this.LayerBankContracts[this.chain.name].pool, amount);

                const tx = await this.walletClient.prepareTransaction(amount);
                tx.to = supply.to;
                tx.data = supply.data;

                const res = await this.walletClient.sendTransactionOnce(tx);
                if (res?.status == 1) {
                    this.logger.info(`${this.walletData.name} | ${this.chain.name} | Success Deposit ${formatEther(amount)} ETH ${this.chain.scan}/${res?.hash}`);
                    break;
                } else {
                    throw Error("Deposit failed");
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
                const poolContract = new ethers.Contract(this.LayerBankContracts[this.chain.name].pool, pool_layerBankAbi, this.walletClient.walletEthers);
                const balance = await poolContract.balanceOf(this.walletClient.walletAddress);

                if (balance == 0) {
                    this.logger.info(`${this.walletData.name} | Insufficient balance on LayerBank!`);
                    break;
                }

                const landingContract = new ethers.Contract(this.LayerBankContracts[this.chain.name].landing, landing_layerBankAbi, this.walletClient.walletEthers);
                const withdraw = await landingContract['redeemToken'].populateTransaction(this.LayerBankContracts[this.chain.name].pool, balance);

                const tx = await this.walletClient.prepareTransaction();
                tx.to = withdraw.to;
                tx.data = withdraw.data;

                const res = await this.walletClient.sendTransactionOnce(tx);
                if (res?.status == 1) {
                    this.logger.info(`${this.walletData.name} | Success Withdraw ${formatEther(balance)} ETH ${this.chain.scan}/${res?.hash}`);
                    break;
                } else {
                    throw new Error("Withdraw failed");
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