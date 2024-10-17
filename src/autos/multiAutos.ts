import { landingConfig, okxConfig, queueConfig, swapConfig } from "../../config";
import { wallet } from "../models/wallet";
import { QueueManager } from "../utils/queueManager";
import { readRoute, readWalletsCsv, updateRoute } from "../utils/reader";
import { getRandomInt, getRandomValue, sleep } from "../helpers";
import { DmailClient } from "../modules/others/dmailClient";
import { CHAINS, ETHEREUM } from "../data/chains";
import { RubyScoreClient } from "../modules/others/rubyScoreClient";
import { DeployClient } from "../modules/others/deployClient";
import { LayerBankClient } from "../modules/landings/layerBankClient";
import { generateRoute } from "../utils/routeManager";
import { OkxClient } from "../modules/cexs/okxClient";
import { parseEther } from "ethers";
import { eth, usdc } from "../data/tokens";
import { OwltoClient } from "../modules/bridges/owltoClient";
import { OrbiterClient } from "../modules/bridges/orbiterClient";
import { AaveClient } from "../modules/landings/aaveClient";
import { BaseSwapClient } from "../modules/swaps/baseSwapClient";
import { OdosClient } from "../modules/swaps/odosClient";
import { MoonWellClient } from "../modules/landings/moonWellClient";
import { Nfts2meClient } from "../modules/others/nfts2meClient";
import { AlienSwapClient } from "../modules/swaps/alienSwapClient";
import { SkydromeClient } from "../modules/swaps/skydromeClient";
import { NitroClient } from "../modules/bridges/nitroClient";

const loggerName = 'MultiFarm';
const routesFile = 'src/data/routes/multiFarm.txt';
const wallets = await readWalletsCsv('./src/data/wallets/multiFarm.csv');
const queueManager = new QueueManager(wallets, getRoute, queueConfig.acitveWallets, [], loggerName);

while (!queueManager.isEmpty()) {
    const data = await queueManager.nextStep();

    if (data == undefined) {
        break;
    }

    const wallet = data[0];
    const step = data[1].split("_");

    try {
        await executeStep(wallet, step);
        const routeToUpdate = queueManager.getWalletRoute(wallet);
        updateRoute(wallet.name, routeToUpdate, routesFile);
    } catch (error) {
        console.log(error);
        queueManager.terminateWalletRoute(wallet);
    }
}

export async function executeStep(wallet: wallet, step: string[]) {
    const module = step.shift();

    switch (module) {
        case "okx": {
            await okx(wallet, step);
            break;
        }
        case "bridge": {
            await bridge(wallet, step);
            break;
        }
        case "landing": {
            await landing(wallet, step);
            break;
        }
        case "swap": {
            await swap(wallet, step);
            break;
        }
        case "nft": {
            await nft(wallet, step);
            break;
        }
        case "others": {
            await others(wallet, step);
            break;
        }
    }
}

export function getRoute(wallet: wallet) {
    let route = readRoute(wallet.name, routesFile);
    if (route == undefined) {
        route = generateRoute();
        updateRoute(wallet.name, route, routesFile);
    }
    return route;
}

export async function okx(wallet: wallet, step: string[]) {
    const method = step.shift() ?? ""
    const chainName = step.shift() ?? "";
    
    let chain; 
    if (chainName != "") {
        chain = getChain(chainName);
    }
    const okx = new OkxClient(wallet, chain, loggerName);

    switch (method) {
        case "withdraw": {
            const amount = getRandomValue(okxConfig.depositToWallet).toFixed(6);
            await okx.FromOkxToWallet(eth, amount);
            break;
        }
        case "deposit": {
            await okx.walletClient.gasChecker();

            const balance = await okx.walletClient.balanceOf();
            const minChainBalance = okxConfig.minBalance[chainName];
            let amount = balance;
            if (minChainBalance != undefined && minChainBalance.length > 0) {
                const minChainBalance = await getRandomValue(okxConfig.minBalance[chainName]);
                const minChainBalanceWei = parseEther(minChainBalance.toFixed(6));
                amount = balance - minChainBalanceWei;
                if (amount < 0) {
                    throw new Error(`Balance ${wallet.name} in ${chainName} is too low`);
                }
            }
            await okx.FromWalletNativeToOkx(amount);
            break;
        }
        case "transfer": {
            await OkxClient.tranfserFromSubToMain(wallet, eth, loggerName);
        }
    }
}

export async function bridge(wallet: wallet, step: string[]) {
    const module = step.shift() ?? "";
    const chainNameFrom = step.shift() ?? "";
    const chainNameTo = step.shift() ?? "";

    const chainFrom = getChain(chainNameFrom);
    const chainTo = getChain(chainNameTo);

    let client;
    switch (module) {
        case "owlto": {
            client = new OwltoClient(wallet, chainFrom, loggerName);
            break;
        }
        case "orbiter": {
            client = new OrbiterClient(wallet, chainFrom, loggerName);
            break;
        }
        case "nitro": {
            client = new NitroClient(wallet, chainFrom, loggerName);
            break;
        }
    }

    if (client == undefined) {
        throw new Error("Bridge client is undefined");
    }

    const minChainBalance = okxConfig.minBalance[chainNameFrom];

    let amount = undefined;
    if (minChainBalance != undefined && minChainBalance.length > 0) {
        const randomBalance = getRandomValue(minChainBalance);
        const balance = await client.walletClient.balanceOf();
        const minChainBalanceWei = parseEther(randomBalance.toFixed(6));
        amount = balance - minChainBalanceWei;

        if (amount < 0) {
            throw new Error(`Balance ${wallet.name} in ${chainNameFrom} is too low`);
        }
    }

    await client.walletClient.gasChecker();

    await client.bridge(chainTo, amount);
}

export async function landing(wallet: wallet, step: string[]) {
    const module = step.shift() ?? "";
    const chainName = step.shift() ?? "";
    const method = step.shift() ?? "";

    const chain = getChain(chainName);

    let client;
    switch (module) {
        case "aave": {
            client = new AaveClient(wallet, chain, loggerName);
            break;
        }
        case "layerbank": {
            client = new LayerBankClient(wallet, chain, loggerName);
            break;
        }
        case "moonwell": {
            client = new MoonWellClient(wallet, chain, loggerName);
            break;
        }
    }

    if (client == undefined) {
        throw new Error("Landing client is undefined");
    }    

    await client.walletClient.gasChecker();

    switch (method) {
        case "deposit": {
            const balance = await client.walletClient.balanceOf();
            const amount = balance * BigInt(getRandomInt(landingConfig.percent)) / 100n;
            await client.deposit(amount);
            break;
        }
        case "withdraw": {
            await client.withdraw();
            break;
        }
    }

}

export async function swap(wallet: wallet, step: string[]) {
    const module = step.shift() ?? "";
    const chainName = step.shift() ?? "";
    const method = step.shift() ?? "";

    const chain = getChain(chainName);

    let client;
    switch (module) {
        case "baseswap": {
            client = new BaseSwapClient(wallet, chain, loggerName);
            break;
        }
        case "odos": {
            client = new OdosClient(wallet, chain, loggerName);
            break;
        }
        case "alienswap": {
            client = new AlienSwapClient(wallet, chain, loggerName);
            break;
        }
        case "skydrome": {
            client = new SkydromeClient(wallet, chain, loggerName);
            break;
        }
    }

    if (client == undefined) {
        throw new Error("Swap client is undefined");
    }

    await client.walletClient.gasChecker();

    switch (method) {
        case "ethToStable": {
            const balance = await client.walletClient.balanceOf();
            const amount = balance * BigInt(getRandomInt(swapConfig.percent)) / 100n;
            await client.swap(eth, usdc, amount);
            break;
        }
        case "stableToEth": {
            const balance = await client.walletClient.balanceOf(usdc);
            await client.swap(usdc, eth, balance);
            break;
        }
    }
}

export async function nft(wallet: wallet, step: string[]) {
    const module = step.shift() ?? "";
    const chainName = step.shift() ?? "";

    const chain = getChain(chainName);

    let client;
    switch (module) {
        case "nfts2me": {
            client = new Nfts2meClient(wallet, chain, loggerName);
            break;
        }
    }

    if (client == undefined) {
        throw new Error("Mint client is undefined");
    }

    await client.walletClient.gasChecker();

    await client.mint();
}

export async function others(wallet: wallet, step: string[]) {
    const module = step.shift() ?? "";
    const chainName = step.shift() ?? "";

    const chain = getChain(chainName);

    let client;
    switch (module) {
        case "dmail": {
            client = new DmailClient(wallet, chain, loggerName);
            break;
        }
        case "deploy": {
            client = new DeployClient(wallet, chain, loggerName);
            break;
        }
        case "rubyscore": {
            client = new RubyScoreClient(wallet, chain, loggerName);
            break;
        }
    }

    if (client == undefined) {
        throw new Error("Other client is undefined");
    }

    await client.walletClient.gasChecker();

    await client.use();
}

export function getChain(name: string) {
    const chain = CHAINS.find(x => x.name == name);
    if (chain == undefined) {
        throw new Error(`${name} chain is undefined`)
    }
    return chain;
}
