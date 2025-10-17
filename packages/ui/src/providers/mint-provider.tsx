import { createContext, useContext } from 'react';

import { IMintContext } from '@workspace/types';

export const MintContext = createContext<IMintContext>({} as IMintContext);

export const useMintContext = () => {
  const context = useContext(MintContext);
  if (!context) throw new Error('useMintContext must be used within MintProvider');
  return context;
};
