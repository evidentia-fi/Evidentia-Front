import { PropsWithChildren } from 'react';

import { ILiquidityContext } from '@workspace/types';

import { LiquidityContext } from '@workspace/ui/providers/liquidity-provider';

export const LiquidityProvider = ({ children }: PropsWithChildren) => {
  const mockValue: ILiquidityContext = {
    totalLiquidity: '$8,660,867.14',
    apy: '39.87%',
    protocols: [
      { name: 'Raydium', image: '/icons/ray.svg' },
      { name: 'Orca ', image: '/icons/orca.svg' },
      { name: 'Meteora', image: '/icons/meteora.svg' },
    ],
    pools: [
      {
        pool: 'eUAH / USDT',
        tvl: '$2,000,000',
        apy: '4.70%',
        protocol: 'Raydium',
        protocolSymbol: 'ray',
        network: 'Solana',
        networkSymbol: 'sol',
      },
      {
        pool: 'eUAH / USDC',
        tvl: '$2,450,000',
        apy: '5.00%',
        protocol: 'Orca',
        protocolSymbol: 'orca',
        network: 'Solana',
        networkSymbol: 'sol',
      },
      {
        pool: 'eUAH / SOL',
        tvl: '$1,750,000',
        apy: '8.20%',
        protocol: 'Raydium',
        protocolSymbol: 'ray',
        network: 'Solana',
        networkSymbol: 'sol',
      },
    ],
    markets: [
      {
        protocol: 'Kamino',
        protocolSymbol: 'kamino',
        network: 'Solana',
        networkSymbol: 'sol',
        supplyApy: '4.70%',
        borrowApy: '5.70%',
        availableLiquidity: '$1,250,000',
        utilization: '80%',
      },
      {
        protocol: 'Marginfi',
        protocolSymbol: 'marginfi',
        network: 'Solana',
        networkSymbol: 'sol',
        supplyApy: '5.00%',
        borrowApy: '6.00%',
        availableLiquidity: '$2,575,000',
        utilization: '75%',
      },
    ],
    exchanges: [
      {
        exchange: 'Binance',
        type: 'Spot',
        pairs: 'eUAH/USDT',
      },
      {
        exchange: 'KuCoin',
        type: 'Spot',
        pairs: 'eUAH/BTC',
      },
    ],
  };

  return <LiquidityContext.Provider value={mockValue}>{children}</LiquidityContext.Provider>;
};
