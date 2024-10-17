import _ from 'lodash';
const { cloneDeep } = _;
import { dai, usdc, usdt, weth, wmatic } from "../data/tokens";
import { getRandomInt, getRandomItem } from "../helpers";
import { swap } from "../models/swap";
import { token } from "../models/token";
import { bebopConfig } from '../../config';

export type routeToken = {
    count: number,
    token: token
}

const tokens: routeToken[] = [
    { count: 100, token: wmatic },
    { count: 100, token: usdc },
    { count: 100, token: usdt },
    { count: 100, token: weth },
    { count: 2, token: dai },
];

export function generateRoute(): string[] {
    while (true) {
        try {
            const route = generate();
            const lastToken = route[route.length - 1].to;
            if (lastToken.length == 1 && lastToken[0].name == wmatic.name) {
                // console.log(route.map(x => `${x.ratio?.join(', ')} ${x.to.map(x => x.name).join(', ')}`));

                route.push({ from: [usdt, usdc, dai, weth], amount: [100], to: [wmatic], ratio: undefined });

                return toString(route);
            }
        } catch (error) {
            // console.log(error);
        }
    }
}

function generate(): swap[] {
    const route: swap[] = [];
    const availableTokens = cloneDeep(tokens);
    let currentTokens: token[] = [wmatic];
    const routeLength = getRandomInt(bebopConfig.routeLength);

    for (let i = 0; i < routeLength; i++) {
        const swap = getNextStep(currentTokens, availableTokens);
        route.push(swap);
        currentTokens = [...swap.to];
    }
    // console.log(route.map(x => `${x.ratio?.join(', ')} ${x.to.map(x => x.name).join(', ')}`));
    return route;
}

function getNextStep(currentTokens: token[], allTokens: routeToken[]): swap {
    let res = allTokens.filter(x => !currentTokens.some(y => y.name == x.token.name) && x.count > 0);
    let swap: swap;
    const tokensToSwap: token[] = [];
    let ratio: number[] | undefined = undefined;

    if (currentTokens.length == 1) {
        const tokenToSwap1 = getRandomToken(res);
        tokensToSwap.push(tokenToSwap1)
        res = res.filter(x => x.token != tokenToSwap1);
        const tokenToSwap2 = getRandomToken(res);
        tokensToSwap.push(tokenToSwap2);
        ratio = getRandomRatio();
    } else {
        const tokenToSwap = getRandomToken(res);
        tokensToSwap.push(tokenToSwap);
    }

    swap = { from: [...currentTokens], amount: [], to: tokensToSwap, ratio: ratio };

    return swap;
}

function getRandomToken(tokens: routeToken[]): token {
    const random = getRandomItem(tokens);
    random['count']--;
    return random['token'];
}

function getRandomRatio(): number[] {
    const ratio: number[] = [];
    const first = getRandomInt([1, 100]);
    ratio.push(first);
    ratio.push(100 - first);
    return ratio.map(x => x / 100);
}

function toString(route: swap[]): string[] {
    const stringRoute: string[] = [];

    route.forEach(x => {
        const from = x.from.map(x => x.name).join('_');
        const to = x.to.map(x => x.name).join('_');

        const ratio = x.ratio?.map(x => x.toString()).join('_') ?? "";

        const step = `${from}|${to}|${ratio}`;

        stringRoute.push(step);
    });

    return stringRoute;
}

export function toSwap(step: string) {
    const from = step.split('|')[0].split('_').map(x => tokens.find(t => t.token.name == x)?.token);
    const to = step.split('|')[1].split('_').map(x => tokens.find(t => t.token.name == x)?.token);

    let ratio = undefined;
    if (step.split('|')[2].length > 0) {
        ratio = step.split('|')[2].split('_').map(x => Number(x));
    }

    return { from: from, amount: [], to: to, ratio: ratio } as swap;
}
