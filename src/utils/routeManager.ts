
import _ from 'lodash';
const { cloneDeep } = _;
import { BASE, LINEA, OPTIMISM } from "../data/chains"
import { getRandomInt, getRandomIntNew, getRandomItem } from "../helpers"
import { shuffle } from "./common"

export const chainsLength: any = {
    ethereum: 1,
    scroll: [6, 12],
    base: [6, 10],
    zksync: []
}

export const okx = {
    use: false,
    to: [BASE, LINEA, OPTIMISM],
    from: [BASE, LINEA, OPTIMISM]
}

export const bridge: any = {
    use: false,
    methods: ["bridge"],
    chains: {
        scroll: ["owlto", "orbiter", "nitro"],
        base: ["owlto", "orbiter", "nitro"],
        optimism: ["owlto", "orbiter"],
        linea: ["owlto", "orbiter"]
    }
}

export const landing = {
    name: "landing",
    methods: [["deposit", "withdraw"]],
    chains: {
        scroll: ["layerbank", "aave"],
        base: ["moonwell", "aave"]
    }
}

export const swap = {
    name: "swap",
    methods: [["ethToStable", "stableToEth"]],
    chains: {
        scroll: ["skydrome"],
        base: ["baseswap", "alienswap", "odos"],
        linea: [],
        polygon: ["bebop"]
    }
}

export const nft = {
    name: "nft",
    methods: [["mint"]],
    chains: {
        scroll: ["nfts2me"],
        base: ["nfts2me"],
        zksync: ["nfts2me"]
    }
}

export const others = {
    name: "others",
    methods: [["use"]],
    chains: {
        scroll: ["dmail", "rubyscore", "deploy"],
        base: ["dmail", "rubyscore"]
    }
}

export const actions: any = {
    scroll: [landing, swap, nft, others],
    base: [landing, swap, nft, others]
}

export function generateRoute() {
    const chains = shuffle(["scroll", "base"]);
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