import { CELO, CORE, FUSE, GNOSIS, HARMONY, KLAYTN, LOOT, MATIC, MOONBEAM, MOONRIVER, shimmerEVM, VICTION, kavaEVM } from "./src/data/chains";

export const generalConfig: any = {
    useCrypto: false,
    attempts: 5,
    attemptsDelay: 100,
    maxGwei: {
        "ethereum": 40,
        "base": 0.01,
        "scroll": 0.45,
        "linea": 1.7,
        "zksync": 1
    },
    maxGweiDelay: 300
}

export const swapConfig = {
    slippage: 1,
    percent: [80, 90]
}

export const landingConfig = {
    percent: [80, 95]
}

export const queueConfig = {
    acitveWallets: 15, // количество активных кошельков
    walletsDelay: [50, 50], // задержка между кошельками в секундах
    firstWalletsDelayX: 3, // 
    stepsDelay: [2000, 3000], // задержка между шагами в секундах
    checkDelay: [50, 100], // задежка между проверками в секундах
}

export const bebopConfig = {
    routeLength: [10, 14],
    bebopSwapPercent: [85, 100]
}

export const okxConfig: any = {
    depositToWallet: [0.004, 0.005], // количество токен с биржи Okx
    minBalance: {
        "base": [0.02, 0.04],
        "scroll": [0.02, 0.04],
        "linea": [0.003, 0.005],
        "polygon": [],
        "optimism": []
    }
}

export const l2passConfig = {
    refuelChains: [
        { from: MATIC, to: [GNOSIS, MOONBEAM, MOONRIVER, CELO, kavaEVM, FUSE, KLAYTN, CORE, HARMONY, shimmerEVM, LOOT, VICTION] }
    ],
    chainAmount: [
        { chain: GNOSIS, amount: [0.01, 0.019168] },
        { chain: MOONBEAM, amount: [0.01, 0.05] },
        { chain: MOONRIVER, amount: [0.0001, 0.0005] },
        { chain: CELO, amount: [0.01, 0.02] },
        { chain: kavaEVM, amount: [0.01, 0.02] },
        { chain: FUSE, amount: [0.01, 0.05] },
        { chain: KLAYTN, amount: [0.01, 0.025] },
        { chain: CORE, amount: [0.01, 0.025] },
        { chain: HARMONY, amount: [0.01, 1] },
        { chain: shimmerEVM, amount: [0.01, 0.392] },
        { chain: LOOT, amount: [0.01, 0.011035] },
        { chain: VICTION, amount: [0.01, 0.021879] }
    ]
}

export class OKXAuth {
    static okx_proxy = '';  // proxy url | http://login:password@ip:port |
    static okx_apiKey = '';
    static okx_apiSecret = '';
    static okx_apiPassword = '';
}

export const proxies = [];
