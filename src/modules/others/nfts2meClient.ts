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
        ],
        scroll: [
            "0x3ea1C01BAB9a047d0aDC3f2eB2F426AEd7Eee5Fc",
            "0x4F1E9f09aF32257E16Af610fb1c94d38371d93f9",
            "0x273E78151cD2Db0Dc9F4899828C18e521A2941cC",
            "0xBfE46Dc40ADf83a792F7dB364Eb148E2C835cB49",
            "0x1F0A4060e70D072556d0D9A2848A217812B1B7e8",
            "0x1C8070f79b01988D4024dc569962e77b06c6a7C5",
            "0xD57F08e91A3Be3D5FD331C3f97874bCEd28CaB0B",
            "0xd89031e0FD22f33F8239573a4965Fd081562DFD9",
            "0xA73be3606357618F483176a65b3693FA9f849cE3",
            "0x5b213159252c3cbb2a620Fe97C46033f32496c59",
            "0x1E3e89a5c51cA7543Bf1124e5C2F594314A773B9",
            "0xc476B1c18C5A6Bd824269af13508187E53751E72",
            "0x5e362cc619878f5FC7c06318A98ea9099482D0d0",
            "0x581E50cDC17c6FBF93D893514C71AA5893118c13",
            "0x9f739d133689244a0Ff2752eB1796D385C0Ca358",
            "0x7301a42D2d58e702C2439fBE8925D9Ad9d2Cc264",
            "0x2B7128e8c493e18759c5346AE68B3a53645A8568",
            "0x818CeE34a3a4cD0B465028C6200A2656480C88ce",
            "0xbDa15D2f6d9b0177b31574E50A6e4eC0f2f5CE74",
            "0xC87CE5B3648Ef8ea832b18e44020eB0cF3D8642e",
            "0xED3aE48d051e1b8EecE2b4AFaA485641398f5984",
            "0x6C02Eae312d466549380Cc344456F85c158434de",
            "0xC48182c7b60E03908e7D966Db2caf91E26bB4cFE",
            "0xf4e7eBcA3C4EAe2ee937c80d24F7593226068c73",
            "0x3f7099923c98E2FFCe08acd241FDFeDb0e1BBBb3",
            "0x1DfaDd24Eec719Ea4E451a603bf302e11f810183",
            "0x68E63042789966765A5eF89a3A8bdEf4f8b8A81D",
            "0xE59ECCeEBDE3f0063f2FcBf71eDfB6855EC662ac",
            "0x0fe92b4cb60aFafdbf63b396A553288e1b138e5A",
            "0xf4d4e95c1A35381da8E2dA1062dCabe9d58fCC9C",
            "0x4e9E3AAeF27fb4b39B6df9af6c83DBDa4ca2A3ea",
            "0x5520f2cD1F119f242CFAE54309F2518e66f48D4E",
            "0x9751686A5bE48b89929667c92c3d2e1EaA2F6f4d",
            "0x474a65B257DD2F918b3f2c58092D86F58AaF59D0",
            "0xaE9F1386e511D6D678C01Cb04e079BE04a19ED33",
            "0xE7a9d25159F5d7032a5Aec16269443B5ee26502C",
            "0xF41716cF7214BF319B8D914312D225cbB91e0FdA",
            "0x7e8Ab3A1f112E50B0595B1eed80c3859a15ed40A",
            "0xcCF35758aBdE587a4A5F552Cc9EE8Ff60086065F",
            "0x09BD34B9C8049e23984E9D09821Eb2AE0693ab45",
            "0x251c07a78832f53471460D34c93974825791cecf",
            "0x4C826C813f7D622EDAccE46abe0d89BE3478aA45",
            "0x97d976568A36bAC0bAD93B3FB9452b461EDf1DbE",
            "0x1150E28602b673226F1627c6493E869AF1e26f34",
            "0x200c7C35936c807354a0a5905d8c9F7BBBfAb5bE",
            "0x01517f5C684A82C773D290Ccb82FBc2D53958774",
            "0x819bf0616f030cB4F19D8a2b636D42701Af22B43",
            "0xd1f612e1531E1F25ec851B8D7160F9e10F6Ca289",
            "0x624CA1be563d74aE16393200B81f8dFa1a41643b",
            "0x9bF210F821F5FD62E539cd00BAb1e056900A2313",
            "0xf70F60144A608001941Be3569b42C5eb9DbdD82a",
            "0x9A37AA46179635304CDE84D6a74B7139CD566Daf",
            "0x0dA9ac979b01ad5029E13A9C24FFC70f7a087176",
            "0x1f1AFe43B8278adf0D89f4960507b731454Ba1c8",
            "0x53fbd662B453344603aAF23caF79EB78A7F375fE",
            "0x7fBa1e70D645b3AfF359C360C91acFc3b8D42Ee6",
            "0x134C53C4310AC4a3D8e64DA4E72B7D23ad7038F6",
            "0x1C5A64725f0cFD6D059B049E14d7800a639B9517",
            "0x15e6E3256F4A919438a2BF7d6CFE99cAE53eb1A1",
            "0xA67e2cd55dD9F2c183cfA4400DCa9F92f86E84C7",
            "0xE5D0Ec076a3A94C6174b63C50A6918A4511241a7",
            "0x07bD384F702EbAD9Da8Bd66e2274841f42C88597",
            "0x19Fa769FA67663BA72865CA555D6A86a986442a5",
            "0x63FC03FfabbF53Ed1de9DAB6B80aDBe4Ce85443B",
            "0xd2863A21cdc735cB1E7b037Fa38c4915185cBDB9",
            "0x870f960c32b7Da748eab5b879D3e80d4A449E698",
            "0x837AdE79ee845C7582efe0148CA344f0cD36b26a",
            "0xcD89E20eEB4b140feC1E0A74d22B6DEe4F948E92",
            "0x0Ef405379aBaAfe3963bA5f2Bb5c89154a3e0dB6",
            "0xf8440e09f12e7015248549E1EA619480E6740D2f",
            "0x7429917b18f0459Ca5741f2Cc8cd69aa990539f3",
            "0x88818Ec0Ab71dFcB64d6d1F3f358e5232078EC9D",
            "0x2cA22CAB9f4D0dc583D9aB82EA1160EA1C4ae8cC",
            "0x9aAE2e9B736e47D0215dbC537b7632148d5175ef",
            "0x7f4DF9f6f5a06B4E523B4D49dd58594509f29403",
            "0x774ACc5CA33726E509489774Bcc41f16f9D683b1",
            "0x015c5d0573956B97F8474663284dDDCCc0019459",
            "0xF2D5502d708a19f0f8F9b53781336EC8bd02f216",
            "0x75B451DeB0596Da742354A20c38BA9E08B802656"
            ],
        zksync: [
            "0x48F7aED7023e645486f9E6Bf913EFba60D5Ac627",
            "0x569F54C7b18b48629249e64cc90493f5881c3Ec5",
            "0xb1C27903381c12F0dD2605914743CDBbD6DDD66B",
            "0x0Ae114D305C16349C55E9ac09261e62e489806f7",
            "0x029E0eC4BAFdc9666076C0d10ff9C711315a03aD",
            "0xa9952b540531D06eFC6bd96829F373448F04f54b",
            "0x675b85379E661FCDb3DA39D89a0aD395F963754D",
            "0x825368Ed7a8Dae031Dd41F49D1AA4D5843C26fa5",
            "0xed7e91FDeE5B854E656e5Cfb4e83a0D72e2a76A7",
            "0x0021AEa25c8a56aA5ac84bA7e5A034f86dd1604f",
            "0xeA8DDFb29CB04A808F4dfCa2bA269bd88140847C",
            "0x4B63f83b5BAF486bb7481254bEeeC50D1F87f69F",
            "0x39c432833541f46CDd4ffBfD9b78e6469d13FdaE",
            "0x9315051bc48260d396840e64E69bF0d04031BF05",
            "0xf368d6cdD9660200514E341e54EeBf360b1a27D9",
            "0x7014dB93CcC91D35e64136F41E6a86CEa97eDb1C",
            "0xC516F27937B49eadB59a32338Df43C89C918876c",
            "0xbc078d689BdeA65E01dC38d3CD7afbF969cac4A5",
            "0xd69Db0569AE9f8D8991c4c625E6f7C1D2E576420",
            "0x5aFAF3ec8f8eFFC6FBD4b1d076bF3e905F6313e0",
            "0x4a3c41536359CE81aFb7b97bFDD39Aa68937E490",
            "0xF8948b9fcc49016Cfcb87F7CD586f6a106B6A4D6",
            "0x0B5d8D5FF924DAfE8F4B95A168164C1F9945a8b0",
            "0xA5E7cA692aBf7C216Ca3f37BD15CD3051399F95B",
            "0x019276c14DEcF9E056Cdc44BCdb0ee9e6a667bC7",
            "0x018E2f061cb511A6fB064cbD0a68fAF9070644c9",
            "0xc61016475501a82f14DdD0304978d449d5F21d75",
            "0xfF6382a5e3f1123792D52F483F2c4343210b83aA",
            "0x55574eCD068C7bf3f73cd75dB81bF88310B71A90",
            "0x0Fabd7BbaBB2912360f8A95Ccf250DcB6C749441",
            "0x78A900067c7F634105a9be711aB338AF8068C686",
            "0x8a6f12Db092Cc0D0D7D4a10cfCc803B05399D0a8",
            "0x148D0f93bE11f780166345d85626474D2230aEa4",
            "0x84741ad693fd845720BD86da9E23e47fC305095f",
            "0x6F361FC86296C3C2C723BBE3B1Cce2C1296841A1",
            "0x684626f35eF51e20Ac222179A0e98AB363bE8182",
            "0xBE61F663FbBd2d5b59587A96A2E9728F521FC692",
            "0xd3595015f6747f21364FC762e1Cfd3Bb2007B4dD",
            "0x109f3916985f04729eF1c1a581F044a7E38Dd0D1",
            "0x3FCcEb9ce767ee08afC0b1b034A07ccf3168737A",
            "0x96fC1eA93c3486891896FBa93a91cE32898aD3fD",
            "0xd348697306875b44223F77122B7BC73A496cd495",
            "0x53541Cc5D004265fbacD8e2AFD09ca4eE38F66AD",
            "0xA83F0e2A89f7aB7ac7cD7712e3A8271353E53DEf",
            "0x47faA52c4dcf6B779479Ac295C26875f656Ba4fe",
            "0x051601037A92353f840eBa76dea95FCb59C1717F",
            "0xB166cfc6f3474Da7Aa76d94C83B2CaC3dA256e2d",
            "0xEF6740E485E423C5E6c349BF63E8F4d7221F77C2",
            "0x312182CEBb813EcF88cB194105ccBa1de2658B3f",
            "0x958F00CE381EaB69C76312cDF89A083d4309a1e1",
            "0x3d814F24Ab9D12b9d5d24F1963227a1F7CaB9109",
            "0x43Ab7465c802Ea8c74AB8C5C5F04F952D4860f53",
            "0xB4cd3F3995dB72c1E8AadFaF12f3c0808f255CeE",
            "0x4e5b5B21743E0d24A96DBE446153Beb2E35F1b70"
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