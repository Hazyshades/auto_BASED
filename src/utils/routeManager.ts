
import _ from 'lodash';
const { cloneDeep } = _;
import { BASE } from "../data/chains"
import { getRandomInt, getRandomIntNew, getRandomItem } from "../helpers"
import { shuffle } from "./common"

export const chainsLength: any = {
    ethereum: 1,
    base: [6, 10],
}

export const okx = {
    use: false,
    to: [BASE],
    from: [BASE]
}

export const bridge: any = {
    use: false,
    methods: ["bridge"],
    chains: {
        base: ["owlto", "orbiter", "nitro"]
    }
}

export const landing = {
    name: "landing",
    methods: [["deposit", "withdraw"]],
    chains: {
        base: ["moonwell", "aave"]
    }
}

export const swap = {
    name: "swap",
    methods: [["ethToStable", "stableToEth"]],
    chains: {
        base: ["baseswap", "alienswap", "odos"]
    }
}

export const nft = {
    name: "nft",
    methods: [["mint"]],
    chains: {
        base: ["nfts2me"]    }
}

export const others = {
    name: "others",
    methods: [["use"]],
    chains: {
        base: ["dmail", "rubyscore", "deploy"]
    }
}

export const actions: any = {
    base: [landing, swap, nft, others]
}

export function generateRoute() {
    const chains = shuffle([, "base"]);
    const fullRoute = [];

    if (okx.use) {
        const first = chains[0];
        const okxTo = getRandomItem(okx.to);
        fullRoute.push(`okx_withdraw_${okxTo.name}`);
    
        if (okxTo.name != first) {
            const bridgeUse = getRandomItem(bridge.chains[okxTo.name]);
            fullRoute.push(`bridge_${bridgeUse}_${okxTo.name}_${first}`);
        }
    }

    for (let i = 0; i < chains.length; i++) {
        const chain = chains[i];
        const chainLength = getRandomIntNew(chainsLength[chain]);
        const chainSteps = [];

        const cloneActions = cloneDeep(actions);

        while (chainSteps.length < chainLength) {
            const action = getRandomItem(cloneActions[chain]);
            
            if (action.chains[chain].length == 0) {
                continue
            }

            const dex = getRandomItem(action.chains[chain]);
            action.chains[chain] = action.chains[chain].filter((x: any) => x != dex);
            let steps = [...getRandomItem(action.methods)];

            for (let step of steps) {
                step = `${action.name}_${dex}_${chain}_${step}`;
                chainSteps.push(step);
            }
        }

        if (bridge.use) {
            if (i < chains.length - 1) {
                const bridgeUse = getRandomItem(bridge.chains[chain]);
                chainSteps.push(`bridge_${bridgeUse}_${chain}_${chains[i + 1]}`);
            }
        }

        fullRoute.push(...chainSteps);
    }

    if (okx.use) {
        const lastChain = chains[chains.length - 1];
        let okxFromChain;
    
        if (!okx.from.some(x => x.name == lastChain)) {
            const bridgeUse = getRandomItem(bridge.chains[lastChain]);
            okxFromChain = getRandomItem(okx.from);
            fullRoute.push(`bridge_${bridgeUse}_${lastChain}_${okxFromChain.name}`);
        }
    
        fullRoute.push(`okx_deposit_${okxFromChain ? okxFromChain.name : lastChain}`);
        fullRoute.push(`okx_transfer`);
    }

    return fullRoute;
}