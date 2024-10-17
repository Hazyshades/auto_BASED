import CryptoJS from "crypto-js";

export function encrypt(str: string, password: string) {
    return CryptoJS.AES.encrypt(str, password).toString();
}

export function encryptFile(filePath: string, password: string) {
    
}

export function decrypt(str: string, password: string) {
    var bytes  = CryptoJS.AES.decrypt(str, password);
    return bytes.toString(CryptoJS.enc.Utf8);
}