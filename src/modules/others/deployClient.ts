import { makeLogger } from "../../logger"
import { WalletClient } from "../../utils/walletClient"
import { wallet } from "../../models/wallet"
import { chain } from "../../models/chain"
import { sleep } from "../../utils/common"
import { generalConfig } from "../../../config"
import { ContractFactory, ethers } from "ethers"
import { getRandomInt, getRandomItem } from "../../helpers"
import { readContracts, updateContracts } from "../../utils/reader"

export class DeployClient {
    walletClient: WalletClient;
    logger: any;
    loggerName: string = "DeployClient";

    contracts = [{
        abi: [{"inputs":[],"name":"increaseCounter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"x","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"}],
        function: "increaseCounter",
        byteCode: "60806040525f805f6101000a81548161ffff021916908361ffff16021790555034801561002a575f80fd5b50610178806100385f395ff3fe608060405234801561000f575f80fd5b5060043610610034575f3560e01c80630c55699c14610038578063b49004e914610056575b5f80fd5b610040610060565b60405161004d91906100c7565b60405180910390f35b61005e610071565b005b5f8054906101000a900461ffff1681565b60015f808282829054906101000a900461ffff1661008f919061010d565b92506101000a81548161ffff021916908361ffff160217905550565b5f61ffff82169050919050565b6100c1816100ab565b82525050565b5f6020820190506100da5f8301846100b8565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610117826100ab565b9150610122836100ab565b9250828201905061ffff81111561013c5761013b6100e0565b5b9291505056fea2646970667358221220bc63f7476cfe9770d42efd664e385db0549968514c2c32c2f8a97791c696a82864736f6c63430008180033"
    }]

    constructor(walletData: wallet, chain: chain, logger?: string) {
        this.loggerName = logger ? `${logger} | ${this.loggerName}` : this.loggerName;
        this.logger = makeLogger(this.loggerName);

        this.walletClient = new WalletClient(walletData, chain, logger);
    }

    async use() {
        this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Deploy contract`);

        let attempts = 0;
        while (attempts < generalConfig.attempts) {
            try {
                const data = getRandomItem(this.contracts);

                const factory = new ContractFactory(data.abi, data.byteCode, this.walletClient.walletEthers);
                const newContract = await factory.deploy(await this.walletClient.provider.getFeeData());
                await newContract.waitForDeployment();

                const sleepTime = getRandomInt([100, 400]);
                this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | sleep ${sleepTime} seconds `);
                await sleep(sleepTime);

                const address = await newContract.getAddress();
                updateContracts(this.walletClient.chain.name, address);

                const useAddress = getRandomItem(readContracts(this.walletClient.chain.name));
                const contract = new ethers.Contract(useAddress, data.abi, this.walletClient.walletEthers);
                const tx = await contract[data.function].populateTransaction();
                const feeData = await this.walletClient.provider.getFeeData();

                tx.maxFeePerGas = feeData.maxFeePerGas ?? undefined;
                tx.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas ?? undefined;

                const res = await this.walletClient.sendTransactionOnce(tx);
                if (res?.status == 1) {
                    this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Success Deploy contract and IncreaseCounter ${this.walletClient.chain.scan}/${res.hash}`);
                    break;
                } else {
                    throw new Error("Deploy failed");
                }
            } catch (error) {
                this.logger.error(error);

                attempts++;
                this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Wait ${generalConfig.attemptsDelay} sec and retry Deploy contract ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                if (attempts === generalConfig.attempts) {
                    throw new Error(error);
                }
            }
        }
    }
}