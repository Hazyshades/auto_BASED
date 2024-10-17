
import fs from "fs-extra"
import { wallet } from "../models/wallet";
import { Hex } from "viem";
import { generalConfig } from "../../config";
import { decrypt } from "./crypto";
import { createInterface } from "readline";
import Web3 from "web3";

export const readWalletsCsv = async (filePath: string) => {
    let password: string = '';

    if (generalConfig.useCrypto) {
        const readline = createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        password = await (new Promise(resolve => readline.question('Write password: ', resolve))) as string;

        if (password == undefined || password == '') {
            throw Error('password failure');
        }
    }

    let lines: string[] = [];
    let wallets: wallet[] = [];

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        lines = fileContent.split('\n').map(line => line.trim()).filter(line => line !== '');
        lines.shift();
        wallets = lines.map(x => {

            if (generalConfig.useCrypto) {
                x = decrypt(x, password);
            }

            const data = x.split(',');
            return { name: data[0], address: Web3.utils.toChecksumAddress(data[1]), privateKey: data[2], okx: data[3], subId: data[4]}
        })
    } catch (error) {
        console.error('Error reading the file:', error.message);
    }

    return wallets;
}

export const readActive = (accountName: string, filePath: string) => {
    filePath = filePath ?? "src/data/active.txt";

    let lines: string[] = [];

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        lines = fileContent.split('\n').map(line => line.trim()).filter(line => line !== '');
    } catch (error) {
        console.error('Error reading the file:', error.message);
    }

    return lines.includes(accountName);
}

export const updateActive = (accountNames: string[], filePath: string) => {
    filePath = filePath ?? "src/data/active.txt";

    try {
        fs.writeFileSync(filePath, accountNames.join("\n"), 'utf-8');
    } catch (error) {
        throw new Error("Не удалось обновить активные кошельки")
    }
}

export const readRoute = (accountName: string, filePath: string) => {
    filePath = filePath ?? "src/data/routes.txt";

    let lines: string[] = [];

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        lines = fileContent.split('\n').map(line => line.trim()).filter(line => line !== '');
    } catch (error) {
        console.error('Error reading the file:', error.message)
        return [];
    }

    let line = lines.find((x: any) => x.split(",")[0] == accountName);

    if (line != undefined) {
        const route = line.split(",").slice(1).filter(x => x.trim() != '');
        return route;
    }

    return undefined;
}

export const updateRoute = (accountName: string, newRoute: string[], filePath: string) => {
    filePath = filePath ?? "src/data/routes.txt";

    const line = accountName + "," + newRoute.join(",");
    let lines: string[] = [];

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        lines = fileContent.split('\n').map(line => line.trim()).filter(line => line !== '');
    } catch (error) {
        console.error('Error reading the file:', error.message)
        return [];
    }

    let oldRouteIndex = lines.findIndex(x => x.split(",")[0] == accountName);

    if (oldRouteIndex < 0) {
        lines.push(line);
    } else {
        lines[oldRouteIndex] = line;
    }

    try {
        fs.writeFileSync(filePath, lines.join("\n"), 'utf-8');
    } catch (error) {

    }
}

export const readContracts = (chain: string) => {
    const filePath = `src/data/deploy/${chain}.txt`;
    let contracts: string[] = [];

    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        contracts = fileContent.split('\n').map(line => line.trim()).filter(line => line !== '');
        return contracts;
    } catch (error) {
        throw new Error("Не удалось прочитать файл с контрактами")
    }
}

export const updateContracts = (chain: string, contract: string) => {
    const filePath = `src/data/deploy/${chain}.txt`;

    try {
        fs.appendFileSync(filePath, '\n' + contract, 'utf-8');
    } catch (error) {
        throw new Error("Не удалось сохранить контракт в файл")
    }
}

export function privateKeyConvert(privateKey: string): Hex {
    if (privateKey.startsWith('0x')) {
        return privateKey as Hex
    } else {
        return `0x${privateKey}`
    }
}

export function readWallets(filePath: string) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const lines = fileContent.split('\n').map(line => line.trim()).filter(line => line !== '')
        return lines
    } catch (error) {
        console.error('Error reading the file:', error.message)
        return []
    }
}

export function writeWallets(filePath: string, lines: string[]) {
    try {
        fs.writeFileSync(filePath, lines.join("\n"), 'utf-8');
    } catch (error) {
        console.error('Error writing the file:', error.message);
    }
}
