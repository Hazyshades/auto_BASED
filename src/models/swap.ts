import { token } from "./token"

export type swap = {
    from: token[],
    amount: number[],
    to: token[],
    ratio: number[] | undefined,
}