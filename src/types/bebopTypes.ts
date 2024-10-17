export const JAM_PARAM_TYPES = {
    "JamOrder": [
        { "name": "taker", "type": "address" },
        { "name": "receiver", "type": "address" },
        { "name": "expiry", "type": "uint256" },
        { "name": "nonce", "type": "uint256" },
        { "name": "executor", "type": "address" },
        { "name": "minFillPercent", "type": "uint16" },
        { "name": "hooksHash", "type": "bytes32" },
        { "name": "sellTokens", "type": "address[]" },
        { "name": "buyTokens", "type": "address[]" },
        { "name": "sellAmounts", "type": "uint256[]" },
        { "name": "buyAmounts", "type": "uint256[]" },
        { "name": "sellNFTIds", "type": "uint256[]" },
        { "name": "buyNFTIds", "type": "uint256[]" },
        { "name": "sellTokenTransfers", "type": "bytes" },
        { "name": "buyTokenTransfers", "type": "bytes" },
    ]
}