import { createContext, useContext } from 'react';

import { IStableContext } from '@workspace/types';

export const StableContext = createContext<IStableContext>({} as IStableContext);

export const useStable = (): IStableContext => {
  const context = useContext(StableContext);
  if (!context) {
    throw new Error('useStable must be used within a StableProvider');
  }
  return context;
};
