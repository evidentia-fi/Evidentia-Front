import { ITronTokenStore } from '@workspace/types';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

const initialState: Omit<ITronTokenStore, 'set' | 'reset'> = {
  trxBalance: '0',
  tokenBalance: '0',
  allowance: '0',
  name: '',
  symbol: '',
  decimals: 0,
  handleBridgeToEvm: async () => {
    console.warn('Bridge function not implemented');
  },
  refetch: async () => {
    console.warn('Refetch function not implemented');
  },
};

export const useTronTokenStore = createWithEqualityFn<ITronTokenStore>(
  set => ({
    ...initialState,
    set: partial => set(partial),
    reset: () => set(initialState),
  }),
  shallow,
);

/**
 * Custom hook for accessing the stake store with shallow comparison.
 *
 * This hook ensures that components only re-render when the selected state
 * values change shallowly. Useful when selecting objects or arrays to prevent
 * unnecessary re-renders.
 *
 * @template T - The selected state type.
 * @param selector - A function that selects part of the state from the store.
 * @returns The selected part of the store's state.
 */

export const useTronToken = <T>(selector: (state: ITronTokenStore) => T) =>
  useTronTokenStore(selector, shallow);
