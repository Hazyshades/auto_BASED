import { makeLogger } from "../../logger"
import { WalletClient } from "../../utils/walletClient"
import { wallet } from "../../models/wallet"
import { chain } from "../../models/chain"
import { sleep } from "../../utils/common"
import { generalConfig } from "../../../config"
import { ethers } from "ethers"
import { getRandomItem } from "../../helpers"
import { nfts2meAbi } from "../../abi/nfts2meAbi"

export class Nfts2meClient {
    walletClient: WalletClient;
    logger: any;
    loggerName: string = "Nfts2meClient";

    nftContracts: any = {
        base: [
            "0xE6d91Cd3cC34FC1651B1b266076371069803541a", // https://vivid-astrocat.nfts2.me
            "0x60F5731b303B3C738f1a615002fD45f15aFd9A15", // https://cat-pub.nfts2.me
            "0xE426Bf233976118f6C73dF69A96e75d7E5A155ce", // https://daring-n2m-meow.nfts2.me
            "0xaB7f4b31f428Da842e79468334810DD37Ca042C4", // https://cap-of-cat.nfts2.me
            "0xf961134F2Cc52414e00b1A99AC28a91720f1ACf5", // https://forest-huyh26.nfts2.me
            "0x77Fd3c0Ceb6f012Ff31c3b5eE0E0a5fCF096f398", // https://creater.nfts2.me
            "0x685FE57A8BeAC9f2F970A10956b461a5Df6BAc79", // https://alien-yokndj.nfts2.me
            "0xE113d342742a61ac1f5dF5e0f69fb30bBa6a8B68", // https://n2m-base-pjqkwd.nfts2.me
            "0x2d9260ddBdB973897F2204552916a9F69e9C4FC7", // https://base-chips.nfts2.me
            "0x3438C1B32e3027e0eB46b732Ef1F3AF8DeA20A12", // https://dreamed.nfts2.me
            "0xecb8E400F3f936367B8cbE52AFAdcEC6C554a6DF", // https://wants.nfts2.me
            "0xA0a69394B9eFC5FA0538dc2866556D610A33743E", // https://glowing-n2m-bob.nfts2.me
            "0xE0927d5BdB225627C2797A230de11d427314560d", // https://stream.nfts2.me
            "0x55bC623101D7943b281f8C71E3f48E45C20D7ECa", // https://amazing-n2m-no.nfts2.me
            "0x0e2304E008416fd23385576Fe62e3F3C20d07eae", // https://suppliers.nfts2.me
            "0x2a89D33ebEd40E31bf93f331Ccfac907512214b5", // https://super-n2m-all.nfts2.me
            "0x0F0b2ae15a5BfECD8173efD4F651Aa5C3a8bB11E"  // https://samsa.nfts2.me
        ]
       
    };

    constructor(walletData: wallet, chain: chain, logger?: string) {
        this.loggerName = logger ? `${logger} | ${this.loggerName}` : this.loggerName;
        this.logger = makeLogger(this.loggerName);

        this.walletClient = new WalletClient(walletData, chain, logger);
    }

    async mint() {
        this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | mint NFT`);

        let attempts = 0;
        while (attempts < generalConfig.attempts) {
            try {
                const nft = getRandomItem(this.nftContracts[this.walletClient.chain.name]);
                const nftContract = new ethers.Contract(nft, nfts2meAbi, this.walletClient.walletEthers);
                const mint = await nftContract['mint'].populateTransaction();

                const tx = await this.walletClient.prepareTransaction();
                tx.to = mint.to;
                tx.data = mint.data;

                const res = await this.walletClient.sendTransactionOnce(tx);
                if (res?.status == 1) {
                    this.logger.info(`${this.walletClient.walletData.name} | ${this.walletClient.chain.name} | Success mint NFT ${this.walletClient.chain.scan}/${res?.hash}`);
                    break;
                } else {
                    throw new Error(`Failed mint NFT | ${nft}`);
                }
            } catch (error) {
                this.logger.error(error);

                attempts++;
                this.logger.info(`${this.walletClient.walletData.name} | Wait ${generalConfig.attemptsDelay} sec and retry mint NFT ${attempts}/${generalConfig.attempts}`);
                await sleep(generalConfig.attemptsDelay);

                if (attempts === generalConfig.attempts) {
                    throw new Error(error);
                }
            }
        }
    }
}