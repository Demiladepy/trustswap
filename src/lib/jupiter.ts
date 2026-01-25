
import { getSwapQuote as apiGetQuote } from '@/api/jupiter';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';

// Toggle for mock mode
const MOCK_MODE = false;

export const getSwapQuote = async ({ inputMint, outputMint, amount, decimals = 9 }: { inputMint: string, outputMint: string, amount: number, decimals?: number }) => {
    return await apiGetQuote(inputMint, outputMint, amount, decimals);
};

/**
 * Executes a swap using Jupiter V6 API and Solana wallet adapter.
 * @param wallet Wallet adapter (must support signTransaction)
 * @param quote Jupiter swap quote
 * @param connection Solana connection
 */
export const executeSwap = async (wallet: any, quote: any, connection: Connection) => {
    if (MOCK_MODE) {
        // Mock fallback for testing
        await new Promise(res => setTimeout(res, 1000));
        return { txHash: 'mock_tx_hash', success: true };
    }

    // 1. Fetch swap transaction from Jupiter API
    const swapTxRes = await fetch('https://quote-api.jup.ag/v6/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            route: quote.route,
            userPublicKey: wallet.publicKey.toString(),
            wrapUnwrapSOL: true,
            asLegacyTransaction: false
        })
    });
    if (!swapTxRes.ok) throw new Error('Failed to fetch swap transaction');
    const { swapTransaction } = await swapTxRes.json();

    // 2. Deserialize transaction
    const txBuffer = Buffer.from(swapTransaction, 'base64');
    const transaction = Transaction.from(txBuffer);

    // 3. Let wallet sign the transaction
    const signed = await wallet.signTransaction(transaction);

    // 4. Send transaction
    const txid = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(txid);

    return { txHash: txid, success: true };
};
