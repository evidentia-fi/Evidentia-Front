import { PropsWithChildren } from 'react';

import { StableContext } from '@workspace/ui/providers/stable-provider';

export const StableProvider = ({ children }: PropsWithChildren) => {
  const balance = '1234.56';
  const symbol = 'eUAH';
  const decimals = 6;
  const isLoading = false;

  const refetch = async () => {
    console.log('Mock refetch викликано');
    return Promise.resolve();
  };

  return (
    <StableContext.Provider
      value={{
        balance,
        symbol,
        decimals,
        isLoading,
        refetch,
      }}
    >
      {children}
    </StableContext.Provider>
  );
};
