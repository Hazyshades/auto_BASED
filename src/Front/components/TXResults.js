import React from 'react';

function TransactionResult({ hash }) {
    return (
        <div>
            <h2>Transaction Successful!</h2>
            <p>Your NFT minting transaction was successful. Here is the transaction hash:</p>
            <a
                href={`https://base.scan/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                View on Explorer
            </a>
        </div>
    );
}

export default TransactionResult;
