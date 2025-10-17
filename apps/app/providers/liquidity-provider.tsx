import React, { PropsWithChildren, useMemo } from 'react';

import { ILiquidityContext, IPool, IV4Pool } from '@workspace/types';
import { useQuery } from 'urql';

import { LiquidityContext } from '@workspace/ui/providers/liquidity-provider';

import { env } from '@workspace/utils/config';
import { numberFormat } from '@workspace/utils/constants';
import { V4PoolQuery, calculateApr } from '@workspace/utils/graphql';

export const LiquidityProvider = ({ children }: PropsWithChildren) => {
  const unixTimestampFor24HoursAgo = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
  const poolAddress = env.UNISWAP_POOL_ID_ADDRESS;

  const [result] = useQuery<IV4Pool>({
    query: V4PoolQuery,
    variables: {
      poolId: poolAddress,
      time: unixTimestampFor24HoursAgo,
    },
  });

  const { data } = result;
  const feeTier = Number(data?.pool?.feeTier ?? '0');
  const tvl = Number(data?.pool?.totalValueLockedUSD ?? '0');
  const volume24h = Number(data?.poolDayDatas?.[0]?.volumeUSD ?? '0');
  const token0 = data?.pool?.token0;
  const token1 = data?.pool?.token1;

  const poolApr = useMemo(
    () =>
      calculateApr({
        volume24h,
        tvl,
        feeTier,
      }),
    [tvl, feeTier, volume24h],
  );
  const totalApr = poolApr.toFixed(2);

  const pool = useMemo<IPool>(
    () => ({
      pool: `${token0?.symbol ?? ''}/${token1?.symbol ?? ''}`.replace('eUAH', 'UAHe'),
      tvl: numberFormat(tvl),
      apy: totalApr,
      protocol: 'Uniswap V4',
      protocolSymbol: 'uni',
      network: 'Ethereum',
      networkSymbol: 'eth',
      linkUrl: `https://app.uniswap.org/explore/pools/ethereum/${poolAddress}`,
    }),
    [tvl, totalApr],
  );

  const values: ILiquidityContext = useMemo(
    () => ({
      totalLiquidity: '-',
      apy: '-',
      protocols: [],
      pools: [pool],
      markets: [],
      exchanges: [],
    }),
    [pool],
  );

  return <LiquidityContext.Provider value={values}>{children}</LiquidityContext.Provider>;
};
