import React, { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';

import { ILiquidityContext, IPool, IV4Pool } from '@workspace/types';
import { useQuery } from 'urql';

import { LiquidityContext } from '@workspace/ui/providers/liquidity-provider';

import { env } from '@workspace/utils/config';
import { numberFormat } from '@workspace/utils/constants';
import { V4PoolQuery, calculateApr } from '@workspace/utils/graphql';

type LiquiditySnapshot = {
  feeTier: number;
  tvl: number;
  volume24h: number;
  token0Symbol: string;
  token1Symbol: string;
  totalApr: number;
};

const isValidSnapshot = (snapshot: LiquiditySnapshot | null) => {
  if (!snapshot) return false;
  return snapshot.tvl > 0 && snapshot.volume24h >= 0;
};

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

  const lastGoodSnapshotRef = useRef<LiquiditySnapshot | null>(null);
  const [snapshot, setSnapshot] = useState<LiquiditySnapshot | null>(null);

  useEffect(() => {
    const { data } = result;

    const feeTier = Number(data?.pool?.feeTier ?? '0');
    const tvl = Number(data?.pool?.totalValueLockedUSD ?? '0');
    const volume24h = Number(data?.poolDayDatas?.[0]?.volumeUSD ?? '0');
    const token0Symbol = data?.pool?.token0?.symbol ?? '';
    const token1Symbol = data?.pool?.token1?.symbol ?? '';

    const poolApr = calculateApr({
      volume24h,
      tvl,
      feeTier,
    });

    const currentSnapshot: LiquiditySnapshot = {
      feeTier,
      tvl,
      volume24h,
      token0Symbol,
      token1Symbol,
      totalApr: poolApr,
    };

    if (isValidSnapshot(currentSnapshot)) {
      lastGoodSnapshotRef.current = currentSnapshot;
      setSnapshot(currentSnapshot);
      return;
    }

    if (isValidSnapshot(lastGoodSnapshotRef.current)) {
      setSnapshot(lastGoodSnapshotRef.current);
      return;
    }

    setSnapshot(currentSnapshot);
  }, [result]);

  const effectiveSnapshot: LiquiditySnapshot = snapshot ?? {
    feeTier: 0,
    tvl: 0,
    volume24h: 0,
    token0Symbol: '',
    token1Symbol: '',
    totalApr: 0,
  };

  const exchanges = [
    {
      exchange: 'Whitebit',
      type: 'Spot',
      pairs: 'USDT/UAHE',
      link: 'https://whitebit.com/trade/USDT-UAHE?type=spot',
    },
  ];

  const pool = useMemo<IPool>(
    () => ({
      pool: `${effectiveSnapshot.token0Symbol}/${effectiveSnapshot.token1Symbol}`.replace('eUAH', 'UAHe'),
      tvl: numberFormat(effectiveSnapshot.tvl),
      apy: effectiveSnapshot.totalApr.toFixed(2),
      protocol: 'Uniswap V4',
      protocolSymbol: 'uni',
      network: 'Ethereum',
      networkSymbol: 'eth',
      linkUrl: `https://app.uniswap.org/explore/pools/ethereum/${poolAddress}`,
    }),
    [effectiveSnapshot.tvl, effectiveSnapshot.totalApr, effectiveSnapshot.token0Symbol, effectiveSnapshot.token1Symbol, poolAddress],
  );

  const values: ILiquidityContext = useMemo(
    () => ({
      totalLiquidity: `$${numberFormat(effectiveSnapshot.tvl)}`,
      apy: `${effectiveSnapshot.totalApr.toFixed(2)}%`,
      protocols: [{ name: 'Uniswap V4', image: '/icons/uni.svg' }],
      pools: [pool],
      markets: [],
      exchanges,
    }),
    [pool, effectiveSnapshot.tvl, effectiveSnapshot.totalApr],
  );

  return <LiquidityContext.Provider value={values}>{children}</LiquidityContext.Provider>;
};
