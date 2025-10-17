import React, { PropsWithChildren } from 'react';

import { ContractServiceContext } from '@workspace/ui/providers/contract-service-provider';

import { solContractServicesMock } from '@workspace/utils/services';

export const ContractServiceProvider = ({ children }: PropsWithChildren) => {
  return (
    <ContractServiceContext.Provider value={solContractServicesMock}>
      {children}
    </ContractServiceContext.Provider>
  );
};
