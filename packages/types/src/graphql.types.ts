interface Token {
  name: string;
  symbol: string;
  decimals: number;
}

export interface IV4Pool {
  pool: {
    totalValueLockedUSD: string;
    feeTier: string;
    token0: Token;
    token1: Token;
  };
  poolDayDatas: {
    volumeUSD: string;
  }[];
}
