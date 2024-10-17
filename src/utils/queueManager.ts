import moment from "moment";
import { queueConfig } from "../../config";
import { getRandomValue, sleep } from "../helpers";
import { makeLogger, makeResultLogger } from "../logger";
import { readActive, updateActive } from "./reader";

interface queueItem {
    wallet: any,
    route: any[],
    lastTx: any,
    delay: number,
    proxy: any
}

export class QueueManager {
    activeQueue: queueItem[] = [];
    waitingQueue: queueItem[] = [];

    walletsData: any[];
    getRoute: any;
    active: number;
    loggerName: string;
    logger: any;
    resultLogger: any;
    proxy: any[];
    previous: any;
    isFirstStep: boolean = true;

    constructor(wallets: any[], route: any, active: number, proxy?: any[], logger?: string) {
        this.walletsData = wallets;
        this.getRoute = route;
        this.active = active;
        this.proxy = proxy ? proxy : [];

        this.loggerName = logger ? logger : "";
        this.logger = makeLogger(logger ? `${logger} | QueueManager` : "QueueManager");
        this.resultLogger = makeResultLogger(logger ? `${logger} | QueueManager` : "QueueManager");

        this._initQueue();
    }

    public isEmpty(): boolean {
        return this.activeQueue.length == 0;
    }

    public getWalletRoute(wallet: any): string[] {
        const item = this.activeQueue.find(x => x.wallet.name == wallet.name);
        if (item == undefined) {
            throw new Error(`Wallet ${wallet.name} queue item is undefined`);
        }
        return item.route;
    }

    public async nextStep() {
        this._deleteFinishWallets();
        let current = this._getNextWallet();

        if (this.activeQueue.length == 0) {
            return;
        }

        while (current == undefined) {
            const delay = getRandomValue(queueConfig.checkDelay);
            console.log(`Wait ${delay} seconds for next step`);
            await sleep(delay);
            current = this._getNextWallet();
        }

        if (!this.isFirstStep && this.previous?.name != current.wallet.name) {
            this.logger.info(`${current.wallet.name} | Wait ${Math.abs(current.delay)} sec before route step`);
            await sleep(Math.abs(current.delay));
        } else {
            this.isFirstStep = false;
        }

        this.previous = current.wallet;

        this._setDelay(current);
        current.lastTx = moment();

        return [current.wallet, current.route.shift()];
    }

    public terminateWalletRoute(wallet: any) {
        this.activeQueue = this.activeQueue.filter(x => x.wallet.address != wallet.address);
        this.logger.error(`${wallet.name} | ${this.loggerName ? this.loggerName + " | " : ""}Something went wrong, route terminated!`);
        this.resultLogger.info(`${wallet.name} | ${this.loggerName ? this.loggerName + " | " : ""}Route Failed`);
    }

    private _initQueue() {

        for (const wallet of this.walletsData) {
            const delay = getRandomValue(queueConfig.walletsDelay) * queueConfig.firstWalletsDelayX;

            const queueItem = { wallet: wallet, delay: delay, lastTx: undefined, proxy: undefined, route: this.getRoute(wallet) };
            if (queueItem.route.length == 0) {
                continue;
            }

            if (readActive(wallet.name, `src/data/queue/active${this.loggerName}.txt`)) {
                this.activeQueue.push(queueItem);
            } else {
                this.waitingQueue.push(queueItem);
            }
        }

        this.waitingQueue = this.waitingQueue.sort((a, b) => a.delay - b.delay);

        if (this.activeQueue.length < this.active) {
            const diff = this.active - this.activeQueue.length;
            this.activeQueue.push(...this.waitingQueue.slice(0, diff));
            this.waitingQueue = this.waitingQueue.slice(diff);
        }

        updateActive(this.activeQueue.map(x => x.wallet.name), `src/data/queue/active${this.loggerName}.txt`);

        this.activeQueue.forEach(x => this._setProxy(x.wallet));
        this._logQueue();
    }

    private _setDelay(item: queueItem) {
        const delay = getRandomValue(queueConfig.walletsDelay);
        this.activeQueue.forEach(x => x.delay = x.delay - (delay / 10))
        let queueItem = this.activeQueue.find(x => x.wallet == item.wallet);

        if (queueItem != null)
            queueItem.delay = delay;

        this.activeQueue = this.activeQueue.sort((a, b) => a.delay - b.delay);
    }

    private _getNextWallet() {
        const now = moment();
        const avaliableWallets = this.activeQueue.filter(x => x.lastTx == undefined || now.diff(x.lastTx, 'seconds') > getRandomValue(queueConfig.stepsDelay));
        return avaliableWallets.length > 0 ? avaliableWallets[0] : undefined;
    }

    private _deleteFinishWallets() {
        const finishWallets = this.activeQueue.filter(x => x.route.length == 0);
        this.activeQueue = this.activeQueue.filter(x => x.route.length > 0);
        finishWallets.forEach(x => {
            this.logger.warn(`${x.wallet.name} | ${this.loggerName ? this.loggerName + " | " : ""}Route finish`);
            this.resultLogger.info(`${x.wallet.name} | ${this.loggerName ? this.loggerName + " | " : ""}Route Success`);
            this._nextWalletToActive();
        })
    }

    private _nextWalletToActive() {
        if (this.activeQueue.length < this.active && this.waitingQueue.length > 0) {
            const next = this.waitingQueue.shift();
            if (next == undefined) {
                return;
            }
            this._setProxy(next.wallet);
            this.activeQueue.push(next);
        }

        updateActive(this.activeQueue.map(x => x.wallet.name), `src/data/queue/active${this.loggerName}.txt`);
        this._logQueue();
    }

    private _setProxy(wallet: any) {
        const proxy = this.proxy.shift();
        wallet.proxy = proxy;
        this.proxy.push(proxy);
    }

    private _logQueue() {
        this.logger.info('activeQueue: ' + this.activeQueue.map(x => x.wallet.name).join(', '));
        this.logger.info('waitingQueue: ' + this.waitingQueue.map(x => x.wallet.name).join(', '));
    }
}