import React, { useState } from 'react';
import MintForm from './components/MintForm';
import TransactionResult from './components/TransactionResult';

function App() {
    const [transactionHash, setTransactionHash] = useState(null);
    const [error, setError] = useState(null);

    const handleMint = async (walletData, chain) => {
        try {
            const response = await fetch('/api/nfts/mint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ walletData, chain }),
            });

            const data = await response.json();
            if (response.ok) {
                setTransactionHash(data.hash);
                setError(null);
            } else {
                setError(data.message || 'Failed to mint NFT');
            }
        } catch (err) {
            setError('Error occurred while minting NFT');
            console.error(err);
        }
    };

    return (
        <div className="App">
            <h1>Mint NFT on Base</h1>
            <MintForm onMint={handleMint} />
            {transactionHash && <TransactionResult hash={transactionHash} />}
            {error && <div className="error">{error}</div>}
        </div>
    );
}

export default App;
