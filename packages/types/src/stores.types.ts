import { Dispatch, SetStateAction } from 'react';

export interface IAccountContext {
  address: string | undefined;
  addressTron: string | null;
  symbol: string | undefined;
  networkName: string | undefined;
  chainId: number;
  explorerUrl: string | undefined;
  isConnected: boolean;
  isConnectedTron: boolean;
  loading: boolean;
  connect: () => void;
  disconnect: () => void;
  disconnectTron: () => void;
  addAsset: (args: { symbol: string; decimals: number }) => Promise<void>;
  addAssetToTonLink: (args: { symbol: string; decimals: number }) => Promise<void>;
}

export interface IStableContext {
  balance: string;
  decimals: number;
  symbol: string;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export interface IMintContext {
  balance: string;
  totalBorrowed: string;
  totalStaked: string;
  totalDebt: string;
  availableBorrow: string;
  interrest: string;
  interestRate: number;
  decimals: number;
  symbol: string;
  isApprovedForAll: boolean;
  isLoadingTransaction: boolean;
  borrow: ({ amount }: { amount: bigint }) => Promise<unknown>;
  handleRepay: ({ amount }: { amount: bigint }) => Promise<unknown>;
  handleSupplyNFT: ({ tokenId, amount }: { tokenId: bigint; amount: bigint }) => Promise<unknown>;
  withdrawNFT: ({ tokenId, amount }: { tokenId: bigint; amount: bigint }) => Promise<unknown>;
  availableToUnstakeAsync: (nftId: string) => Promise<number>;
  availableToStakeAsync: (nftId: string) => Promise<number>;
}

export interface IStakeContext extends IStableContext {
  stakedAmount: string;
  reward: string;
  totalStaked: string;
  allowance: string;
  refetchStable: () => Promise<void>;
  handleStake: (props: { amount: bigint }) => Promise<void>;
  unstake: (props: { amount: bigint }) => Promise<void>;
  claimReward: () => Promise<void>;
}

export interface IPool {
  pool: string;
  tvl: string;
  apy: string;
  protocol: string;
  protocolSymbol: string;
  network: string;
  networkSymbol: string;
  explorerUrl?: string;
  linkUrl?: string;
}

export interface ILiquidityContext {
  totalLiquidity: string;
  apy: string;
  protocols: {
    name: string;
    image: string;
  }[];
  pools: IPool[];
  markets: {
    protocol: string;
    protocolSymbol: string;
    network: string;
    networkSymbol: string;
    supplyApy: string;
    borrowApy: string;
    availableLiquidity: string;
    utilization: string;
  }[];

  exchanges: {
    exchange: string;
    type: string;
    pairs: string;
  }[];
}

export interface IBridgeStore {
  allowance: string;
  options: { name: string; symbol: string }[];
  handleBridgeToTron: (props: { toAddress: string; amount: string }) => Promise<void>;
  handleBridgeToBase: (props: { toAddress: string; amount: string }) => Promise<void>;
  handleBridgeToEthereum: (props: { toAddress: string; amount: string }) => Promise<void>;
  set: (partial: Partial<Omit<IBridgeStore, 'set'>>) => void;
}

export interface ICreateBondData {
  value: bigint;
  couponValue: bigint;
  issueTimestamp: bigint;
  expirationTimestamp: bigint;
  ISIN: string;
}

export interface IMintBond {
  id: string;
  isin: string;
  remainingMints: number;
}

export interface IMintNftStore {
  data: {
    id: string;
    isin: string;
    issuer: string;
    balance: number;
    allowedMints: number;
    alreadyMinted: number;
  }[];
  owner: string;
  isAdmin: boolean;
  createBondAsync: (id: bigint, data: ICreateBondData) => Promise<void>;
  setAllowance: (user: string, id: bigint, allowedAmount: bigint) => Promise<void>;
  mint: (id: bigint, amount: bigint) => Promise<void>;
  redeem: (id: bigint, amount: bigint) => Promise<void>;
  isLoading: boolean;
  page: number;
  totalPages: number;
  setPage: Dispatch<SetStateAction<number>>;
  set: (partial: Partial<Omit<IMintNftStore, 'set'>>) => void;
}

export interface ITronTokenStore {
  trxBalance: string;
  tokenBalance: string;
  name: string;
  symbol: string;
  allowance: string;
  decimals: number;
  handleBridgeToEvm: (props: { toAddress: string; amount: string; destinationNetwork?: string }) => Promise<void>;
  refetch: () => Promise<void>;
  set: (partial: Partial<Omit<ITronTokenStore, 'set'>>) => void;
  reset: () => void;
}
