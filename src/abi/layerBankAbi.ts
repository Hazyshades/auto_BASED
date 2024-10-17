export const landing_layerBankAbi = [
    {
        'inputs': [],
        'stateMutability': 'nonpayable',
        'type': 'constructor'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'lToken',
                'type': 'address'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'newBorrowCap',
                'type': 'uint256'
            }],
        'name': 'BorrowCapUpdated',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'newCloseFactor',
                'type': 'uint256'
            }],
        'name': 'CloseFactorUpdated',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': false,
                'internalType': 'address',
                'name': 'lToken',
                'type': 'address'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'newCollateralFactor',
                'type': 'uint256'
            }],
        'name': 'CollateralFactorUpdated',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'target',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'initiator',
                'type': 'address'
            },
            {
                'indexed': true,
                'internalType': 'address',
                'name': 'asset',
                'type': 'address'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256'
            },
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'premium',
                'type': 'uint256'
            }],
        'name': 'FlashLoan',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': false,
                'internalType': 'address',
                'name': 'newKeeper',
                'type': 'address'
            }],
        'name': 'KeeperUpdated',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': false,
                'internalType': 'address',
                'name': 'newLABDistributor',
                'type': 'address'
            }],
        'name': 'LABDistributorUpdated',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': false,
                'internalType': 'address',
                'name': 'newLeverager',
                'type': 'address'
            }],
        'name': 'LeveragerUpdated',
        'type': 'event'
    },
    {
        'anonymous': false,
        'inputs': [
            {
                'indexed': false,
                'internalType': 'uint256',
                'name': 'newLiquidationIncentive',
                'type': 'uint256'
            }],
        'name': 'LiquidationIncentiveUpdated',
        'type': 'event'
    },
    {
        'anonymous': false, 'inputs': [{ 'indexed': false, 'internalType': 'address', 'name': 'lToken', 'type': 'address' }, { 'indexed': false, 'internalType': 'address', 'name': 'account', 'type': 'address' }], 'name': 'MarketEntered', 'type': 'event'
    },
    {
        'anonymous': false, 'inputs': [{ 'indexed': false, 'internalType': 'address', 'name': 'lToken', 'type': 'address' }, { 'indexed': false, 'internalType': 'address', 'name': 'account', 'type': 'address' }], 'name': 'MarketExited', 'type': 'event'
    },
    {
        'anonymous': false, 'inputs': [{ 'indexed': false, 'internalType': 'address', 'name': 'lToken', 'type': 'address' }], 'name': 'MarketListed', 'type': 'event'
    }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'internalType': 'address', 'name': 'user', 'type': 'address' }, { 'indexed': false, 'internalType': 'address', 'name': 'lToken', 'type': 'address' }, { 'indexed': false, 'internalType': 'uint256', 'name': 'uAmount', 'type': 'uint256' }], 'name': 'MarketRedeem', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'internalType': 'address', 'name': 'user', 'type': 'address' }, { 'indexed': false, 'internalType': 'address', 'name': 'lToken', 'type': 'address' }, { 'indexed': false, 'internalType': 'uint256', 'name': 'uAmount', 'type': 'uint256' }], 'name': 'MarketSupply', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': true, 'internalType': 'address', 'name': 'previousOwner', 'type': 'address' }, { 'indexed': true, 'internalType': 'address', 'name': 'newOwner', 'type': 'address' }], 'name': 'OwnershipTransferred', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'internalType': 'address', 'name': 'account', 'type': 'address' }], 'name': 'Paused', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'internalType': 'address', 'name': 'newRebateDistributor', 'type': 'address' }], 'name': 'RebateDistributorUpdated', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': true, 'internalType': 'address', 'name': 'lToken', 'type': 'address' }, { 'indexed': false, 'internalType': 'uint256', 'name': 'newSupplyCap', 'type': 'uint256' }], 'name': 'SupplyCapUpdated', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'internalType': 'address', 'name': 'account', 'type': 'address' }], 'name': 'Unpaused', 'type': 'event' }, { 'anonymous': false, 'inputs': [{ 'indexed': false, 'internalType': 'address', 'name': 'newValidator', 'type': 'address' }], 'name': 'ValidatorUpdated', 'type': 'event' }, { 'inputs': [{ 'internalType': 'address', 'name': 'account', 'type': 'address' }], 'name': 'accountLiquidityOf', 'outputs': [{ 'internalType': 'uint256', 'name': 'collateralInUSD', 'type': 'uint256' }, { 'internalType': 'uint256', 'name': 'supplyInUSD', 'type': 'uint256' }, { 'internalType': 'uint256', 'name': 'borrowInUSD', 'type': 'uint256' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [], 'name': 'allMarkets', 'outputs': [{ 'internalType': 'address[]', 'name': '', 'type': 'address[]' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': 'lToken', 'type': 'address' }, { 'internalType': 'uint256', 'name': 'amount', 'type': 'uint256' }], 'name': 'borrow', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': 'borrower', 'type': 'address' }, { 'internalType': 'address', 'name': 'lToken', 'type': 'address' }, { 'internalType': 'uint256', 'name': 'amount', 'type': 'uint256' }], 'name': 'borrowBehalf', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': 'account', 'type': 'address' }, { 'internalType': 'address', 'name': 'lToken', 'type': 'address' }], 'name': 'checkMembership', 'outputs': [{ 'internalType': 'bool', 'name': '', 'type': 'bool' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [], 'name': 'claimLab', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': 'market', 'type': 'address' }], 'name': 'claimLab', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address[]', 'name': 'accounts', 'type': 'address[]' }], 'name': 'claimLabBehalf', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [], 'name': 'closeFactor', 'outputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [{ 'internalType': 'uint256', 'name': 'lockDuration', 'type': 'uint256' }], 'name': 'compoundLab', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address[]', 'name': 'lTokens', 'type': 'address[]' }], 'name': 'enterMarkets', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': 'lToken', 'type': 'address' }], 'name': 'exitMarket', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': '_priceCalculator', 'type': 'address' }], 'name': 'initialize', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [], 'name': 'initialized', 'outputs': [{ 'internalType': 'bool', 'name': '', 'type': 'bool' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [], 'name': 'keeper', 'outputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [], 'name': 'labDistributor', 'outputs': [{ 'internalType': 'contract ILABDistributor', 'name': '', 'type': 'address' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [], 'name': 'leverager', 'outputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': 'lTokenBorrowed', 'type': 'address' }, { 'internalType': 'address', 'name': 'lTokenCollateral', 'type': 'address' }, { 'internalType': 'address', 'name': 'borrower', 'type': 'address' }, { 'internalType': 'uint256', 'name': 'amount', 'type': 'uint256' }], 'name': 'liquidateBorrow', 'outputs': [], 'stateMutability': 'payable', 'type': 'function' }, { 'inputs': [], 'name': 'liquidationIncentive', 'outputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address payable', 'name': 'lToken', 'type': 'address' }, { 'internalType': 'uint256', 'name': 'supplyCap', 'type': 'uint256' }, { 'internalType': 'uint256', 'name': 'borrowCap', 'type': 'uint256' }, { 'internalType': 'uint256', 'name': 'collateralFactor', 'type': 'uint256' }], 'name': 'listMarket', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': 'lToken', 'type': 'address' }], 'name': 'marketInfoOf', 'outputs': [{ 'components': [{ 'internalType': 'bool', 'name': 'isListed', 'type': 'bool' }, { 'internalType': 'uint256', 'name': 'supplyCap', 'type': 'uint256' }, { 'internalType': 'uint256', 'name': 'borrowCap', 'type': 'uint256' }, { 'internalType': 'uint256', 'name': 'collateralFactor', 'type': 'uint256' }], 'internalType': 'struct Constant.MarketInfo', 'name': '', 'type': 'tuple' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }], 'name': 'marketInfos', 'outputs': [{ 'internalType': 'bool', 'name': 'isListed', 'type': 'bool' }, { 'internalType': 'uint256', 'name': 'supplyCap', 'type': 'uint256' }, { 'internalType': 'uint256', 'name': 'borrowCap', 'type': 'uint256' }, { 'internalType': 'uint256', 'name': 'collateralFactor', 'type': 'uint256' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': 'account', 'type': 'address' }], 'name': 'marketListOf', 'outputs': [{ 'internalType': 'address[]', 'name': '', 'type': 'address[]' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }, { 'internalType': 'uint256', 'name': '', 'type': 'uint256' }], 'name': 'marketListOfUsers', 'outputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }], 'name': 'markets', 'outputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [], 'name': 'owner', 'outputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [], 'name': 'pause', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [], 'name': 'paused', 'outputs': [{ 'internalType': 'bool', 'name': '', 'type': 'bool' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [], 'name': 'priceCalculator', 'outputs': [{ 'internalType': 'contract IPriceCalculator', 'name': '', 'type': 'address' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [], 'name': 'rebateDistributor', 'outputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': 'lToken', 'type': 'address' }, { 'internalType': 'uint256', 'name': 'lAmount', 'type': 'uint256' }], 'name': 'redeemToken', 'outputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': 'lToken', 'type': 'address' }, { 'internalType': 'uint256', 'name': 'uAmount', 'type': 'uint256' }], 'name': 'redeemUnderlying', 'outputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address payable', 'name': 'lToken', 'type': 'address' }], 'name': 'removeMarket', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [], 'name': 'renounceOwnership', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': 'lToken', 'type': 'address' }, { 'internalType': 'uint256', 'name': 'amount', 'type': 'uint256' }], 'name': 'repayBorrow', 'outputs': [], 'stateMutability': 'payable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'uint256', 'name': 'newCloseFactor', 'type': 'uint256' }], 'name': 'setCloseFactor', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': 'lToken', 'type': 'address' }, { 'internalType': 'uint256', 'name': 'newCollateralFactor', 'type': 'uint256' }], 'name': 'setCollateralFactor', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': '_keeper', 'type': 'address' }], 'name': 'setKeeper', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': '_labDistributor', 'type': 'address' }], 'name': 'setLABDistributor', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': '_leverager', 'type': 'address' }], 'name': 'setLeverager', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'uint256', 'name': 'newLiquidationIncentive', 'type': 'uint256' }], 'name': 'setLiquidationIncentive', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address[]', 'name': 'lTokens', 'type': 'address[]' }, { 'internalType': 'uint256[]', 'name': 'newBorrowCaps', 'type': 'uint256[]' }], 'name': 'setMarketBorrowCaps', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address[]', 'name': 'lTokens', 'type': 'address[]' }, { 'internalType': 'uint256[]', 'name': 'newSupplyCaps', 'type': 'uint256[]' }], 'name': 'setMarketSupplyCaps', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': '_priceCalculator', 'type': 'address' }], 'name': 'setPriceCalculator', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': '_rebateDistributor', 'type': 'address' }], 'name': 'setRebateDistributor', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': '_validator', 'type': 'address' }], 'name': 'setValidator', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'lToken',
                'type': 'address'
            },
            {
                'internalType': 'uint256',
                'name': 'uAmount',
                'type': 'uint256'
            }
        ],
        'name': 'supply',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256'
            }
        ],
        'stateMutability': 'payable',
        'type': 'function'
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'supplier',
                'type': 'address'
            },
            {
                'internalType': 'address', 'name': 'lToken', 'type': 'address'
            }, { 'internalType': 'uint256', 'name': 'uAmount', 'type': 'uint256' }], 'name': 'supplyBehalf', 'outputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }], 'stateMutability': 'payable', 'type': 'function'
    }, { 'inputs': [{ 'internalType': 'address', 'name': 'newOwner', 'type': 'address' }], 'name': 'transferOwnership', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': 'spender', 'type': 'address' }, { 'internalType': 'address', 'name': 'src', 'type': 'address' }, { 'internalType': 'address', 'name': 'dst', 'type': 'address' }, { 'internalType': 'uint256', 'name': 'amount', 'type': 'uint256' }], 'name': 'transferTokens', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [], 'name': 'unpause', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function' }, { 'inputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }, { 'internalType': 'address', 'name': '', 'type': 'address' }], 'name': 'usersOfMarket', 'outputs': [{ 'internalType': 'bool', 'name': '', 'type': 'bool' }], 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [], 'name': 'validator', 'outputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }], 'stateMutability': 'view', 'type': 'function' }]

export const pool_layerBankAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"ammount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"accountBorrow","type":"uint256"}],"name":"Borrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"liquidator","type":"address"},{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"address","name":"lTokenCollateral","type":"address"},{"indexed":false,"internalType":"uint256","name":"seizeAmount","type":"uint256"}],"name":"LiquidateBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"minter","type":"address"},{"indexed":false,"internalType":"uint256","name":"mintAmount","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"},{"indexed":false,"internalType":"uint256","name":"underlyingAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"lTokenAmount","type":"uint256"}],"name":"Redeem","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"payer","type":"address"},{"indexed":false,"internalType":"address","name":"borrower","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"accountBorrow","type":"uint256"}],"name":"RepayBorrow","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_totalBorrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"accInterestIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"accountSnapshot","outputs":[{"components":[{"internalType":"uint256","name":"lTokenBalance","type":"uint256"},{"internalType":"uint256","name":"borrowBalance","type":"uint256"},{"internalType":"uint256","name":"exchangeRate","type":"uint256"}],"internalType":"struct Constant.AccountSnapshot","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"accruedAccountSnapshot","outputs":[{"components":[{"internalType":"uint256","name":"lTokenBalance","type":"uint256"},{"internalType":"uint256","name":"borrowBalance","type":"uint256"},{"internalType":"uint256","name":"exchangeRate","type":"uint256"}],"internalType":"struct Constant.AccountSnapshot","name":"","type":"tuple"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"accruedBorrowBalanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"accruedExchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"accruedTotalBorrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"borrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"borrowBalanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"borrower","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"borrowBehalf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"core","outputs":[{"internalType":"contract ICore","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"exchangeRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAccInterestIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCash","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRateModel","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"uint8","name":"_decimals","type":"uint8"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"initialized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastAccruedTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"lTokenCollateral","type":"address"},{"internalType":"address","name":"liquidator","type":"address"},{"internalType":"address","name":"borrower","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"liquidateBorrow","outputs":[{"internalType":"uint256","name":"seizeLAmount","type":"uint256"},{"internalType":"uint256","name":"rebateLAmount","type":"uint256"},{"internalType":"uint256","name":"liquidatorLAmount","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rateModel","outputs":[{"internalType":"contract IRateModel","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"rebateDistributor","outputs":[{"internalType":"contract IRebateDistributor","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"redeemer","type":"address"},{"internalType":"uint256","name":"lAmount","type":"uint256"}],"name":"redeemToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"redeemer","type":"address"},{"internalType":"uint256","name":"uAmount","type":"uint256"}],"name":"redeemUnderlying","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"repayBorrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"reserveFactor","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"liquidator","type":"address"},{"internalType":"address","name":"borrower","type":"address"},{"internalType":"uint256","name":"lAmount","type":"uint256"}],"name":"seize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_core","type":"address"}],"name":"setCore","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_rateModel","type":"address"}],"name":"setRateModel","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_rebateDistributor","type":"address"}],"name":"setRebateDistributor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_reserveFactor","type":"uint256"}],"name":"setReserveFactor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_underlying","type":"address"}],"name":"setUnderlying","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"uAmount","type":"uint256"}],"name":"supply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"supplier","type":"address"},{"internalType":"uint256","name":"uAmount","type":"uint256"}],"name":"supplyBehalf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalBorrow","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalReserve","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferTokensInternal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"underlying","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"underlyingBalanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdrawReserves","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]