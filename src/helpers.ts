import { Hex } from "viem";
import { ethers } from "ethers";
import { chain } from "./models/chain"
import { token } from "./models/token";
import { erc20Abi } from "./abi/erc20abi";

export const checkBalanceWithPrivate = async (privateKey: Hex, chain: chain, token: token) => {
    let provider = new ethers.JsonRpcProvider(chain.rpc);
    let wallet = new ethers.Wallet(privateKey, provider);

    const tokenContract = await new ethers.Contract(token.differentAddress ?? token.address, erc20Abi, provider);
    let balance;
    let attempts = 0;

    while (attempts < 3) {
        try {
            balance = await tokenContract.balanceOf(wallet.address);
            break;
        } catch (error) {
            attempts++;
            provider = new ethers.JsonRpcProvider(chain.rpc);
            wallet = new ethers.Wallet(privateKey, provider);

            await new Promise(resolve => setTimeout(resolve, 15 * 1000));
        }
    }

    if (balance == undefined) {
        throw new Error("Failed to fetch the balance after multiple attempts.");
    }

    return balance;
};

export const checkBalance = async (address: Hex, chain: chain, token: token) => {
    let provider = new ethers.JsonRpcProvider(chain.rpc);

    const tokenContract = await new ethers.Contract(token.differentAddress ?? token.address, erc20Abi, provider);
    let balance;
    let attempts = 0;

    while (attempts < 3) {
        try {
            balance = await tokenContract.balanceOf(address);
            break;
        } catch (error) {
            attempts++;
            provider = new ethers.JsonRpcProvider(chain.rpc);

            await new Promise(resolve => setTimeout(resolve, 15 * 1000));
        }
    }

    if (balance == undefined) {
        throw new Error("Failed to fetch the balance after multiple attempts.");
    }

    return balance;
};

export const waitForUpdateBalance = async (address: any, chain: chain, balanceCash: any, token: token) => {
    try {
        while (true) {
            await new Promise(resolve => setTimeout(resolve, 120 * 1000));
            let balanceNew = await checkBalance(address, chain, token);

            if (balanceNew > balanceCash) {

                console.log(`Deposit confirmed on wallet`);
                return;
            }
            else {
                console.log(`Deposit not confirmed on wallet yet, waiting 20sec...`);
            }
        }
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};

export const setupDelay = async (delay: number[]) => {
    try {
        const delaySeconds = getRandomValue(delay);
        console.log(`Delaying ${delaySeconds} seconds before next action`);
        await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
};

export const sleep = async (delay: number) => {
    await new Promise(resolve => setTimeout(resolve, delay * 1000));
};

export const getRandomValue = (value: number[]) => {
    const [min, max] = value;
    return Math.random() * (max - min) + min;
};

export const getRandomInt = (value: number[]) => {
    const [min, max] = value;
    return Math.floor(Math.random() * (max - min)) + min;
};

export const getRandomIntNew = (value: number[]) => {
    const [min, max] = value;
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export function getRandomItem(array: any) {
    return array[(Math.floor((Math.random() * array.length)))];
}

export function shuffle(array: Array<Hex>) {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }

    return array
};
