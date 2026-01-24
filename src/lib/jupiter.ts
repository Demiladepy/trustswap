import { getSwapQuote as apiGetQuote } from '@/api/jupiter';

export const getSwapQuote = async ({ inputMint, outputMint, amount }: { inputMint: string, outputMint: string, amount: number }) => {
    // Assuming amount is already in decimals or needs conversion
    const quote = await apiGetQuote(inputMint, outputMint, amount, 9); // default 9 decimals
    return quote;
};

export const executeSwap = async ({ inputMint, outputMint, amount, userPublicKey }: any) => {
    // Mock build transaction
    return {
        transaction: 'mock_tx_base64',
        msg: 'Successfully built'
    };
};
