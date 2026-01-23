"use client";

import React from 'react';
import { TierProvider } from '@/context/TierContext';
import { WalletContextProvider } from '@/context/WalletContext';

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <WalletContextProvider>
            <TierProvider>
                {children}
            </TierProvider>
        </WalletContextProvider>
    );
};
