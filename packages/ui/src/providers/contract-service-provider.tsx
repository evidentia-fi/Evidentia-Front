import { createContext, useContext } from 'react';

import { IContractServiceAPI } from '@workspace/types';

export const ContractServiceContext = createContext<IContractServiceAPI | undefined>(undefined);

export const useContractServices = (): IContractServiceAPI => {
  const context = useContext(ContractServiceContext);
  if (context === undefined) {
    throw new Error('useContractServices must be used within a ContractServiceProvider');
  }
  return context;
};
