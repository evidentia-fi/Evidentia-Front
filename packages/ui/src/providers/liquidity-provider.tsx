import { createContext, useContext } from 'react';

import { ILiquidityContext } from '@workspace/types';

export const LiquidityContext = createContext<ILiquidityContext>({} as ILiquidityContext);

export const useLiquidity = (): ILiquidityContext => {
  const context = useContext(LiquidityContext);
  if (!context) {
    throw new Error('useLiquidity must be used within a LiquidityProvider');
  }
  return context;
};
