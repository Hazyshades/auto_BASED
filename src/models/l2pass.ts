import { chain } from "./chain"

export type refuel = {
    from: chain,
    to: chain[] | chain
}