import { queueConfig } from "../../config";
import { wallet } from "../models/wallet";
import { QueueManager } from "../utils/queueManager";
import { readWalletsCsv } from "../utils/reader";
import { getRandomInt, getRandomItem } from "../helpers";
import { BASE, ETHEREUM, SCROLL, ZKSYNC } from "../data/chains";
import { WalletClient } from "../utils/walletClient";
import { Nfts2meClient } from "../modules/others/nfts2meClient";

const loggerName = 'Nfts2meFarm';
const wallets = await readWalletsCsv('./src/data/wallets/nfts2meFarm.csv');
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

    const chain = getRandomItem([BASE, SCROLL]);

    const nfts2me = new Nfts2meClient(wallet, chain, loggerName);
    await nfts2me.mint();
}

export function getRoute(wallet: any) {
    const lenght = getRandomInt([1, 1]); // длинна маршрута
    return Array(lenght).fill(0);;
}