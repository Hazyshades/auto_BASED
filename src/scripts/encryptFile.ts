import { encrypt } from "../utils/crypto";
import { readWallets, writeWallets } from "../utils/reader";
import readlineSync from 'readline-sync';

const filePath = './src/data/wallets/bebopFarm.csv';

const password = readlineSync.question('write password: ', {
    hideEchoBack: true // Скрывает вводимые символы
});

if (password === undefined || password === "") {
    throw new Error('password failure');
}

let lines: string[] = readWallets(filePath);
let encryptLines = lines.map(x => encrypt(x, password));
writeWallets(filePath, encryptLines);

console.log("Файл зашифрован");
