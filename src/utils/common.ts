import axios from "axios";
import { formatEther } from "viem"
import { WalletClient } from "./walletClient";
import { ETHEREUM } from "../data/chains";
import { ethers, formatUnits } from "ethers";
import { generalConfig } from "../../config";

export function random(min: number, max: number): number {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export const sleep = async (millis: number) => new Promise(resolve => setTimeout(resolve, millis * 1000))

export function shuffle(array: Array<any>) {
    let currentIndex = array.length,  randomIndex
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }

    return array
}

export function getUsdValue(value: bigint, usdPrice: number) {
    return parseFloat(formatEther(value)) * usdPrice
}

export async function getSymbolPrice(symbol: string = 'ETH') {
    return await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`).then(response => {
        return response.data.USD
    })
}

export async function gasChecker() {
    while (true) {
        try {
            const provider = new ethers.JsonRpcProvider(ETHEREUM.rpc);
            const { gasPrice } = await provider.getFeeData();

            if (gasPrice == null) {
                continue;
            }

            const gwei = Math.floor(Number(formatUnits(gasPrice, 'gwei')));
            if (gwei < generalConfig.maxGwei) {
                return;
            }

            console.log(`Now Gas is ${gwei} Gwei, wait ${generalConfig.maxGweiDelay} sec and retry check`);
            await sleep(generalConfig.maxGweiDelay);

        } catch (error) {

        }
    };
}