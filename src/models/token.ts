import { Hex } from "viem"

export type token = {
    name: string,
    address: any,
    differentAddress?: Hex,
    abi: any
}

export type chainToken = {
    name: string,
    abi: any,
    addresses: tokenAddress[]
}

export type tokenAddress = {
    chain: string,
    address: Hex
}