import { createContext, useContext } from 'react';

import { IAccountContext } from '@workspace/types';

export const AccountContext = createContext<IAccountContext>({} as IAccountContext);

export const useAccount = () => {
  const context = useContext(AccountContext);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- check is hook call inside provider
  if (!context) {
    throw new Error('useAccount must be used within a AccountContext');
  }

  return context;
};
