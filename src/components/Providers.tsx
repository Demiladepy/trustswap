"use client";

import React from 'react';
import { TierProvider } from '@/context/TierContext';
import { WalletContextProvider } from '@/context/WalletContext';

import { Toaster } from 'sonner';

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <WalletContextProvider>
            <TierProvider>
                <Toaster position="top-right" theme="dark" richColors closeButton />
                {children}
            </TierProvider>
        </WalletContextProvider>
    );
};
