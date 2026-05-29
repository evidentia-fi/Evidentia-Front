import { ISolanaTokenStore } from '@workspace/types';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

const initialState: Omit<ISolanaTokenStore, 'set' | 'reset'> = {
  solBalance: '0',
  tokenBalance: '0',
  decimals: 0,
  handleBridgeToEvm: async () => {
    throw new Error('Solana → EVM bridge not implemented yet');
  },
  refetch: async () => {
    console.warn('Solana refetch not implemented yet');
  },
};

export const useSolanaTokenStore = createWithEqualityFn<ISolanaTokenStore>(
  set => ({
    ...initialState,
    set: partial => set(partial),
    reset: () => set(initialState),
  }),
  shallow,
);

export const useSolanaToken = <T>(selector: (state: ISolanaTokenStore) => T) =>
  useSolanaTokenStore(selector, shallow);
