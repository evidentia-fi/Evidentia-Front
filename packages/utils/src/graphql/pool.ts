const TokenQuery = `{
  name
  symbol
  decimals
}`;

export const V4PoolQuery = `
  query V4Pool($poolId: String!, $time: Int!) {
    pool(id: $poolId) {
      totalValueLockedUSD
      feeTier
      token0 ${TokenQuery}
      token1 ${TokenQuery}
    }

    poolDayDatas(where: { pool: $poolId, date_gte: $time }) {
      volumeUSD
    }
  }
`;
