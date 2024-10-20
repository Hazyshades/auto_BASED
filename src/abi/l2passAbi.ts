export const l2passAbi = [{
    "inputs": [
        {
            "internalType": "address",
            "name": "lzEndpoint_",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "gasRefuelPrice_",
            "type": "uint256"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
},
{
    "anonymous": false,
    "inputs": [
        {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
        },
        {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
        }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
},
{
    "inputs": [
        {
            "internalType": "uint16",
            "name": "dstChainId",
            "type": "uint16"
        },
        {
            "internalType": "uint256",
            "name": "nativeForDst",
            "type": "uint256"
        },
        {
            "internalType": "address",
            "name": "addressOnDst",
            "type": "address"
        },
        {
            "internalType": "bool",
            "name": "useZro",
            "type": "bool"
        }
    ],
    "name": "estimateGasRefuelFee",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "nativeFee",
            "type": "uint256"
        },
        {
            "internalType": "uint256",
            "name": "zroFee",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "uint16",
            "name": "dstChainId",
            "type": "uint16"
        },
        {
            "internalType": "address",
            "name": "zroPaymentAddress",
            "type": "address"
        },
        {
            "internalType": "uint256",
            "name": "nativeForDst",
            "type": "uint256"
        },
        {
            "internalType": "address",
            "name": "addressOnDst",
            "type": "address"
        }
    ],
    "name": "gasRefuel",
    "outputs": [

    ],
    "stateMutability": "payable",
    "type": "function"
},
{
    "inputs": [

    ],
    "name": "gasRefuelPrice",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "uint16",
            "name": "",
            "type": "uint16"
        },
        {
            "internalType": "bytes",
            "name": "",
            "type": "bytes"
        },
        {
            "internalType": "uint64",
            "name": "",
            "type": "uint64"
        },
        {
            "internalType": "bytes",
            "name": "",
            "type": "bytes"
        }
    ],
    "name": "lzReceive",
    "outputs": [

    ],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [

    ],
    "name": "owner",
    "outputs": [
        {
            "internalType": "address",
            "name": "",
            "type": "address"
        }
    ],
    "stateMutability": "view",
    "type": "function"
},
{
    "inputs": [

    ],
    "name": "renounceOwnership",
    "outputs": [

    ],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "gasRefuelPrice_",
            "type": "uint256"
        }
    ],
    "name": "setGasRefuelPrice",
    "outputs": [

    ],
    "stateMutability": "nonpayable",
    "type": "function"
},
{
    "inputs": [
        {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
        }
    ],
    "name": "transferOwnership",
    "outputs": [

    ],
    "stateMutability": "nonpayable",
    "type": "function"
}
]