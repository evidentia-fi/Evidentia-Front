import { createContext, useContext } from 'react';

import { IStakeContext } from '@workspace/types';

export const StakeContext = createContext<IStakeContext>({} as IStakeContext);

export const useStake = () => {
  const context = useContext(StakeContext);
  if (!context) throw new Error('useStakeContext must be used within StakeProvider');
  return context;
};
