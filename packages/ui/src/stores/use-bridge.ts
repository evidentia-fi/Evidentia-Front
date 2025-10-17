import { IBridgeStore } from '@workspace/types';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export const useBridgeStore = createWithEqualityFn<IBridgeStore>(
  set => ({
    options: [],
    handleBridgeFromEvm: async () => {},
    set: partial => set(partial),
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

export const useBridge = <T>(selector: (state: IBridgeStore) => T) =>
  useBridgeStore(selector, shallow);
