import { chain } from "../models/chain"

export const ETHEREUM: chain = {
    chainId: 1,
    name: "ethereum",
    token: "ETH",
    network: "ETH",
    rpc: "https://rpc.ankr.com/eth",
    scan: "https://etherscan.io/tx"
}

export const MATIC: chain = {
    chainId: 137,
    name: "polygon",
    token: "MATIC",
    network: "MATIC",
    rpc: "https://rpc.ankr.com/polygon/9ac8a364a5256e6c97b72a8600d36d023075796677f329fdd79bdebd9c22cef3",
    scan: "https://polygonscan.com/tx"
}

export const SCROLL: chain = {
    chainId: 534352,
    name: "scroll",
    token: "ETH",
    network: "scroll",
    rpc: "https://rpc.ankr.com/scroll/9ac8a364a5256e6c97b72a8600d36d023075796677f329fdd79bdebd9c22cef3",
    scan: "https://scrollscan.com/tx"
}

export const OPTIMISM: chain = {
    chainId: 10,
    name: "optimism",
    token: "ETH",
    network: "OPTIMISM",
    rpc: "https://1rpc.io/op",
    scan: "https://optimistic.etherscan.io/tx"
}

export const BASE: chain = {
    chainId: 8453,
    name: "base",
    token: "ETH",
    network: "Base",
    rpc: "https://mainnet.base.org",
    scan: "https://base.blockscout.com/tx"
}

export const LINEA: chain = {
    chainId: 59144,
    name: "linea",
    token: "ETH",
    network: "Linea",
    rpc: "https://rpc.linea.build",
    scan: "https://lineascan.build/tx"
}

export const ZKSYNC: chain = {
    chainId: 324,
    name: "zksync",
    token: "ETH",
    network: "zksync",
    rpc: "https://mainnet.era.zksync.io",
    scan: "https://era.zksync.network/tx"
}

export const BSC: chain = {
    chainId: 56,
    name: "bsc",
    token: "BNB",
    network: "",
    rpc: "https://rpc.ankr.com/bsc/",
    scan: "https://bscscan.com/tx"
}

export const GNOSIS: chain = {
    chainId: 100,
    name: "gnosis",
    token: "xDAI",
    network: "",
    rpc: "https://1rpc.io/gnosis",
    scan: "https://gnosisscan.io/tx"
}

export const MOONBEAM: chain = {
    chainId: 1284,
    name: "moonbeam",
    token: "GLMR",
    network: "",
    rpc: "https://moonbeam.public.blastapi.io",
    scan: "https://moonscan.io/tx"
}

export const MOONRIVER: chain = {
    chainId: 1285,
    name: "moonriver",
    token: "MOVR",
    network: "",
    rpc: "https://moonriver.public.blastapi.io",
    scan: "https://moonriver.moonscan.io/tx"
}

export const CELO: chain = {
    chainId: 42220,
    name: "celo",
    token: "CELO",
    network: "",
    rpc: "https://1rpc.io/celo'",
    scan: "https://celoscan.io/tx"
}

export const kavaEVM: chain = {
    chainId: 2222,
    name: "kava evm",
    token: "KAVA",
    network: "",
    rpc: "https://evm.kava.io",
    scan: "https://kavascan.com/tx"
}

export const FUSE: chain = {
    chainId: 122,
    name: "fuse",
    token: "FUSE",
    network: "",
    rpc: "https://rpc.fuse.io",
    scan: "https://explorer.fuse.io/tx"
}

export const KLAYTN: chain = {
    chainId: 2222,
    name: "klaytn",
    token: "KAVA",
    network: "",
    rpc: "https://klaytn.blockpi.network/v1/rpc/public",
    scan: "https://klaytnscope.com/tx"
}

export const CORE: chain = {
    chainId: 0,
    name: "core",
    token: "CORE",
    network: "",
    rpc: "https://rpc.ankr.com/core",
    scan: "https://scan.coredao.org/tx"
}

export const HARMONY: chain = {
    chainId: 0,
    name: "harmony",
    token: "ONE",
    network: "",
    rpc: "https://rpc.ankr.com/harmony",
    scan: "https://explorer.harmony.one/"
}

export const shimmerEVM: chain = {
    chainId: 0,
    name: "shimmer evm",
    token: "SMR",
    network: "",
    rpc: "https://json-rpc.evm.shimmer.network	",
    scan: "https://explorer.evm.shimmer.network"
}

export const LOOT: chain = {
    chainId: 0,
    name: "loot",
    token: "",
    network: "",
    rpc: "",
    scan: ""
}

export const VICTION: chain = {
    chainId: 0,
    name: "loot",
    token: "",
    network: "",
    rpc: "",
    scan: ""
}

export const CHAINS: chain[] = [ETHEREUM, MATIC, BASE, SCROLL, LINEA, ZKSYNC, OPTIMISM]
