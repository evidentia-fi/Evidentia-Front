import React, { PropsWithChildren } from 'react';

import { ContractServiceContext } from '@workspace/ui/providers/contract-service-provider';

import { contractServices } from '@workspace/utils/services';

export const ContractServiceProvider = ({ children }: PropsWithChildren) => {
  return (
    <ContractServiceContext.Provider value={contractServices}>
      {children}
    </ContractServiceContext.Provider>
  );
};
