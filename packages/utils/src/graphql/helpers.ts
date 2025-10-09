import { Percent } from '@uniswap/sdk-core';

import { BIPS_BASE } from '../constants';

/**
 * Calculate the APR of a pool/pair which is the ratio of 24h fees to TVL expressed as a percent (1 day APR) multiplied by 365
 * @param volume24h the 24h volume of the pool/pair
 * @param tvl the pool/pair's TVL
 * @param feeTier the feeTier of the pool or 300 for a v2 pair
 * @returns APR expressed as a percent
 */

export function calculateApr({
  volume24h,
  tvl,
  feeTier,
}: {
  volume24h?: number;
  tvl?: number;
  feeTier?: number;
}): Percent {
  if (!volume24h || !feeTier || !tvl || !Math.round(tvl)) {
    return new Percent(0);
  }
  return new Percent(Math.round(volume24h * (feeTier / (BIPS_BASE * 100)) * 365), Math.round(tvl));
}

export const calculateTotalApr = (poolApr: Percent, rewardsApr: number) => {
  const rewardsAprPercent = new Percent(Math.round(rewardsApr * 100), BIPS_BASE);
  return poolApr.add(rewardsAprPercent);
};
