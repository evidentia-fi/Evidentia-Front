import { PropsWithChildren } from 'react';

import { MintContext } from '@workspace/ui/providers/mint-provider';

export const MintProvider = ({ children }: PropsWithChildren) => {
  const defaultValues = {
    balance: '1000.00',
    totalBorrowed: '250.00',
    totalStaked: '750.00',
    totalDebt: '280.00',
    availableBorrow: '500.00',
    interrest: '30.00',
    interestRate: 3.5,
    decimals: 18,
    symbol: 'eUAH',
    isLoadingTransaction: false,
    borrow: async () => Promise.resolve({}),
    handleRepay: async () => Promise.resolve({}),
    handleSupplyNFT: async () => Promise.resolve({}),
    withdrawNFT: async () => Promise.resolve({}),
    availableToUnstakeAsync: async (nftId: string) => Promise.resolve(0),
    availableToStakeAsync: async (nftId: string) => Promise.resolve(0),
  };

  return <MintContext.Provider value={{ ...defaultValues }}>{children}</MintContext.Provider>;
};
