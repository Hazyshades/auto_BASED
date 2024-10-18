import React, { useState } from 'react';

function MintForm({ onMint }) {
    const [walletData, setWalletData] = useState('');
    const [chain, setChain] = useState('base');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (walletData) {
            onMint({ name: walletData }, { name: chain });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="walletData">Wallet Name:</label>
                <input
                    id="walletData"
                    type="text"
                    value={walletData}
                    onChange={(e) => setWalletData(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="chain">Chain:</label>
                <select id="chain" value={chain} onChange={(e) => setChain(e.target.value)}>
                    <option value="base">Base</option>
                    {/* Добавь дополнительные сети, если необходимо */}
                </select>
            </div>
            <button type="submit">Mint NFT</button>
        </form>
    );
}

export default MintForm;
