import { IMintNftStore } from '@workspace/types';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export const useMintNftStore = createWithEqualityFn<IMintNftStore>(
  set => ({
    data: [
      {
        id: '',
        isin: '',
        issuer: '',
        balance: 0,
        allowedMints: 0,
        alreadyMinted: 0,
      },
    ],
    owner: '',
    isAdmin: false,
    createBondAsync: async () => {},
    setAllowance: async () => {},
    mint: async () => {},
    redeem: async () => {},
    isLoading: true,
    page: 1,
    totalPages: 1,
    setPage: () => {},
    set: partial => set(partial),
  }),
  shallow,
);

/**
 * Custom hook for accessing the stake store with shallow comparison.
 * This hook ensures that components only re-render when the selected state
 * values change shallowly. Useful when selecting objects or arrays to prevent
 * unnecessary re-renders.
 *
 * @template T - The selected state type.
 * @param selector - A function that selects part of the state from the store.
 * @returns The selected part of the store's state.
 */

export const useMintNft = <T>(selector: (state: IMintNftStore) => T) =>
  useMintNftStore(selector, shallow);
