import { Address } from 'viem';

export const env = {
  ENV: process.env.NEXT_PUBLIC_ENV ?? '',
  REOWN_PROJECT_ID: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ?? '',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  STABLES_ADDRESS: (process.env.NEXT_PUBLIC_STABLES_ADDRESS ?? '0x') as Address,
  NFT_ADDRESS: (process.env.NEXT_PUBLIC_NFT_ADDRESS ?? '0x') as Address,
  NFT_STAKING_ADDRESS: (process.env.NEXT_PUBLIC_NFT_STAKING_ADDRESS ?? '0x') as Address,
  STABLES_STAKING_ADDRESS: (process.env.NEXT_PUBLIC_STABLES_STAKING_ADDRESS ?? '0x') as Address,
  OFT_ADAPTER: (process.env.NEXT_PUBLIC_OFT_ADAPTER ?? '0x') as Address,
  TRON_ADDRESS: process.env.NEXT_PUBLIC_TRON_ADDRESS ?? '',
  BASE_ADDRESS: (process.env.NEXT_PUBLIC_BASE_ADDRESS ?? '0x') as Address,
  UNISWAP_POOL_ID_ADDRESS: (process.env.NEXT_PUBLIC_UNISWAP_POOL_ID_ADDRESS ?? '0x') as Address,
  GRAPHQL_KEY: process.env.NEXT_PUBLIC_GRAPHQL_KEY ?? '',
} as const;
