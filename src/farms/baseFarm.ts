import { queueConfig } from "../../config";
import { wallet } from "../models/wallet";
import { QueueManager } from "../utils/queueManager";
import { readWalletsCsv } from "../utils/reader";
import { getRandomInt, getRandomItem } from "../helpers";
import { DmailClient } from "../modules/others/dmailClient";
import { BASE, ETHEREUM } from "../data/chains";
import { RubyScoreClient } from "../modules/others/rubyScoreClient";
import { DeployClient } from "../modules/others/deployClient";
import { BaseNftClient } from "../modules/others/nftClient";
import { WalletClient } from "../utils/walletClient";

const loggerName = 'BaseFarm';
const wallets = await readWalletsCsv('./src/data/wallets/baseFarm.csv');
const queueManager = new QueueManager(wallets, getRoute, queueConfig.acitveWallets, [], loggerName);

while (!queueManager.isEmpty()) {
    const step = await queueManager.nextStep();

    if (step == undefined) {
        break;
    }

    const wallet = step[0];
    const route = step[1];

    try {
        await executeStep(wallet);
    } catch (error) {
        console.log(error);
        queueManager.terminateWalletRoute(wallet);
    }
}

export async function executeStep(wallet: wallet) {
    const walletClient = new WalletClient(wallet, ETHEREUM, loggerName);
    await walletClient.gasChecker();

    const module = getRandomItem(["rubyScore", "deploy"]);

    switch (module) {
        case "mint": {
            const coin = new BaseNftClient(wallet, BASE, loggerName);
            await coin.mintCoinEarnings();
            break;
        };
        case "rubyScore": {
            const rubyScore = new RubyScoreClient(wallet, BASE, loggerName);
            await rubyScore.use();
            break;
        };
        case "deploy": {
            const deploy = new DeployClient(wallet, BASE, loggerName);
            await deploy.use();
            break;
        }
    }
}

export function getRoute(wallet: any) {
    const lenght = getRandomInt([1, 2]);
    return Array(lenght).fill(0);;
}