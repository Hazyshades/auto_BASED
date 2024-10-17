import axios from 'axios';

export default interface TokenData {
	symbol: string,
	name: string,
	decimals: number
	address: string,
	logoURI: string
}

export interface QuoteParams{
	protocols?: string
	fee?: string | number
	gasLimit?: string | number
	connectorTokens?: string | number
	complexityLevel?: string | number
	mainRouteParts?: string | number
	parts?: string | number
	gasPrice?: string | number
};

export interface QuoteResponse{
	fromToken: TokenData
	toToken: TokenData
	toTokenAmount: string
	fromTokenAmount: string
	protocols: Array<any>
	estimatedGas: number
};

export interface SwapParams{
	protocols?: string
	destReceiver?: string
	referrerAddress?: string
	fee?: string | number
	gasLimit?: string | number
	disableEstimate?: boolean
	permit?: string
	burnChi?: boolean
	allowPartialFill?: boolean
	connectorTokens?: string | number
	complexityLevel?: string | number
	mainRouteParts?: string | number
	parts?: string | number
	gasPrice?: string | number
};

export interface SwapResponse {
	fromToken: TokenData
	toToken: TokenData
	toTokenAmount: string
	fromTokenAmount: string
	protocols: Array<any>
	tx: {
		from: string
		to: string
		data: string
		value: string
		gasPrice: string
		gas: number
	}
}

/**
 * @class InchSwapApi
 * @constructor
 * @public
 */
export class InchV5Swap {
	private _chainId: number;
	private _apikey: string;
	private _baseUrl: string;
	private _domain: string;

	/**
	 * @returns Always returns code 200 if API is stable
	*/
	healtcheck = async () => axios.get<{ status: string }>(
		`${this._baseUrl}/healthcheck`,
		{ headers: this.authenticate() }
	).then(res => res.data);

	/**
	 * @returns Address of the 1inch router that must be trusted to spend funds for the exchange
	*/
	approveSpender = async () => axios.get<{address: string}>(
		`${this._baseUrl}/approve/spender`,
		{ headers: this.authenticate() }
	).then((res) => res.data.address);

	/**
	 * @param tokenAddress - Token address you want to exchange
	 * @param amount - The number of tokens that the 1inch router is allowed to spend.If not specified, it will be allowed to spend an infinite amount of tokens. **Example : 100000000000**
	 * @returns Generate data for calling the contract in order to allow the 1inch router to spend funds
	*/
	approveTransaction = async (
		tokenAddress: string, 
		amount?: string | number
	) => axios.get<{ data: string, gasPrice: string, to: string, value: string }>(
		`${this._baseUrl}/approve/transaction`, 
		{ 
			params: { tokenAddress, amount },
			headers: this.authenticate()
		}
	).then(res => res.data);

	/**
	 * @param tokenAddress - Token address you want to exchange
	 * @param walletAddress - Wallet address for which you want to check
	 * @returns The number of tokens that the 1inch router is allowed to spend
	*/
	allowance = async (
		tokenAddress: string, 
		walletAddress: string
	) => axios.get<{allowance: string}>(
		`${this._baseUrl}/approve/allowance`, 
		{ 
			params: { tokenAddress, walletAddress },
			headers: this.authenticate()
		}
	).then(res => res.data.allowance);

	/**
	 * @returns List of liquidity sources that are available for routing in the 1inch Aggregation protocol
	*/
	liquiditySources = async () => axios.get<{protocols: Array<{ id: string, title: string, img: string }>}>(
		`${this._baseUrl}/liquidity-sources`,
		{ headers: this.authenticate() }
	).then(res => res.data.protocols);

	/**
	 * @returns List of tokens that are available for swap in the 1inch Aggregation protocol
	*/
	tokens = async () => axios.get<{ tokens: { [address: string]: TokenData }}>(
		`${this._baseUrl}/tokens`, 
		{ headers: this.authenticate() }
	).then(res => Object.values(res.data.tokens));

	/**
	 * @returns Object of preset configurations for the 1inch router
	*/
	presets = async () => axios.get<{[param: string]: any}>(
		`${this._baseUrl}/presets`, 
		{ headers: this.authenticate() }
	).then(res => res.data);

	/**
	 * @description Find the best quote to exchange via 1inch router
	 * @remarks
	 * **Options:**
	 * - protocols - default: all
	 * - fee - Min: 0; max: 3; Max: 0; max: 3; default: 0
	 * - gasLimit - ammount in units
	 * - connectorTokens - max: 5
	 * - complexityLevel - min: 0; max: 3; default: 2
	 * - mainRouteParts - default: 10; max: 50
	 * - parts - split parts. default: 50; max: 100
	 * - gasPrice - default: fast from network
	 * ***
	 * **One of the following errors:**
	 * - Insufficient liquidity
	 * - Cannot estimate
	 * - You may not have enough ETH balance for gas fee
	 * - FromTokenAddress cannot be equals to toTokenAddress
	 * - Cannot estimate. Don't forget about miner fee. Try to leave the buffer of ETH for gas
	 * - Not enough balance
	 * - Not enough allowance
	 * @param fromTokenAddress  - Example: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
	 * @param toTokenAddress - Example: 0x111111111117dc0aa78b770fa6a738034120c302
	 * @param amount - In token UNITS (amount * (10 ** tokenDecimals)) Example : 10000000000000000
	 * @param options - Full info about options you can find in "remarks"
	*/
	quote = async (
		fromTokenAddress: string, 
		toTokenAddress: string, 
		amount: string | number, 
		options: QuoteParams = {}
	) => 
		axios.get<QuoteResponse>(
			`${this._baseUrl}/quote`, 
			{ 
				params: { fromTokenAddress, toTokenAddress, amount, ...options },
				headers: this.authenticate()
			}
		).then(res => res.data);

	/**
	 * @description Generate data for calling the 1inch router for exchange
	 * @remarks
	 * **Options:**
	 * - protocols - default: all
	 * - destReceiver - Receiver of destination currency. default: fromAddress;
	 * - referrerAddress - string
	 * - fee - Min: 0; max: 3; Max: 0; max: 3; default: 0
	 * - gasLimit - ammount in units
	 * - disableEstimate - 
	 * - permit - https://eips.ethereum.org/EIPS/eip-2612
	 * - burnChi - default: false;` *Suggest to check user's balance and allowance before set this flag; CHI should be approved to spender address*
	 * - allowPartialFill - default: false
	 * - parts - split parts. default: 50; max: 100
	 * - connectorTokens - max: 5
	 * - complexityLevel - min: 0; max: 3; default: 2
	 * - mainRouteParts - default: 10; max: 50
	 * - gasPrice - default: fast from network
	 * ***
	 * **One of the following errors:**
	 * - Insufficient liquidity
	 * - Cannot estimate
	 * - You may not have enough ETH balance for gas fee
	 * - FromTokenAddress cannot be equals to toTokenAddress
	 * - Cannot estimate. Don't forget about miner fee. Try to leave the buffer of ETH for gas
	 * - Not enough balance
	 * - Not enough allowance
	 * @param fromTokenAddress  - Example: 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
	 * @param toTokenAddress  - Example: 0x111111111117dc0aa78b770fa6a738034120c302
	 * @param amount  - In token UNITS (amount * (10 ** tokenDecimals)) Example : 10000000000000000
	 * @param fromAddress - The address that calls the 1inch contract
	 * @param slippage - min: 0; max: 50; (Percentage)
	 * @param options - Full info about options you can find in "remarks"
	*/
	swap = async (
		fromTokenAddress: string, 
		toTokenAddress: string, 
		amount: string | number, 
		fromAddress: string, 
		slippage: string | number, 
		options: SwapParams = {}
	) => 
		axios.get<SwapResponse>(
			`${this._baseUrl}/swap`, 
			{ 
				params: { fromTokenAddress, toTokenAddress, amount, fromAddress, slippage, ...options }, 
				headers: this.authenticate() 
			}
		).then(res => res.data);

	chain = () => this._chainId;

	/**
	 * @param chainId - while the transaction signature process uses the chain ID. (eth - 1 | bsc - 56)
	 * @description Switch chain to other
	*/
	swithChain = (chainId: number | string) => {
		if (isNaN(Number(chainId))) throw new Error('Invlid chainId');
		
		this._chainId = Number(chainId);
		this._baseUrl = `${this._domain}/swap/v5.2/${this._chainId}`;
	}

	setApikey = (newApikey: string) => {
		this._apikey = newApikey;
	}

	private authenticate(){
		return {
			accept: 'application/json',
			Authorization: `Bearer ${this._apikey}`
		}
	}

	/**
	 * @param chainId - while the transaction signature process uses the chain ID. (eth - 1 | bsc - 56)
     * @param params
	*/
	constructor(chainId: number | string, apikey?: string, params: { domain: string }={ domain: 'https://api.1inch.dev' }) {
		if (isNaN(Number(chainId))) throw new Error('Invlid chainId');

		this._apikey = apikey || "";
		this._chainId = Number(chainId);
		this._domain = params.domain;
		this._baseUrl = `${this._domain}/swap/v5.2/${this._chainId}`;
	}
};