import { makeLogger } from "../../logger";
import { wallet } from "../../models/wallet";
import { chain } from "../../models/chain";
import { WalletClient } from "../../utils/walletClient";


export class ScrollBridgeClient {
    walletClient: WalletClient;
    logger: any;
    loggerName: string = "ScrollBridgeClient";

    constructor(walletData: wallet, chain: chain, logger?: string) {
        this.loggerName = logger ? `${logger} | ${this.loggerName}` : this.loggerName;
        this.logger = makeLogger(this.loggerName);

        this.walletClient = new WalletClient(walletData, chain, logger);
    }

    async bridge() {
        
    }
}