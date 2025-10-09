import { Address } from 'viem';

import { IPagination } from './pagination.types';

export enum EBondStatus {
  OWNED = 'owned',
  NFT_STAKE = 'nft_stake',
}

export enum EOftStatus {
  DELIVERED = 'DELIVERED',
  INFLIGHT = 'INFLIGHT',
  PAYLOAD_STORED = 'PAYLOAD STORED',
  FAILED = 'FAILED',
  BLOCKED = 'BLOCKED',
  CONFIRMING = 'CONFIRMING',
}

export interface IContractApy {
  avg_apy: string;
  avg_protocol_apy: string;
  avg_total_borrowed: string;
  avg_total_collateral: string;
  avg_total_staked: string;
  avg_total_supply: string;
  week_start: string;
}

export interface IGetApyRes {
  apy: number;
  apy_data: IContractApy[];
  created_at: string;
  holders: number;
  issuers: number;
  protocol_apy: number;
  total_borrowed: string;
  total_collateral: string;
  total_staked: string;
  total_supply: string;
  total_staked_nft: number;
}

export interface IBond {
  country: string;
  created_at: string;
  currency: string;
  id: number;
  isin: string;
  maturity: string;
  nft_id: string;
  number: string;
  principal: string;
  user_wallet: string;
  coupon_value: string;
  issue_timestamp: string;
  status: EBondStatus;
  bond_id: number;
  collateral_value: number;
}

export interface IBondMetadata {
  country: string;
  coupon_value: string;
  currency: string;
  id: number;
  collateral_value: number;
  isin: string;
  issue_timestamp: string;
  maturity: string;
  nft_id: string;
  nft_count: number;
  principal: string;
}

export enum EContractEventType {
  STABLE_STAKE = 'stable_stake',
  STABLE_TRANSFER = 'stable_transfer',
  STABLE_WITHDRAW = 'stable_withdraw',
  NFT_TRANSFER = 'nft_transfer',
  NFT_STAKE = 'nft_stake',
  NFT_UNSTAKE = 'nft_unstake',
  REWARD_CLAIM = 'reward_claim',
  OFT_SEND = 'oft_send',
  OFT_RECEIVED = 'oft_received',
  BORROW = 'borrow',
  REPAY = 'repay',
  MINT = 'mint',
  MINT_ALLOWANCE_SET = 'mint_allowance_set',
}

type TDestinationNetworkId = 30420 | 40420 | 40161 | 30101;

export interface IContractEvent {
  id: number;
  amount?: string;
  tx_hash: Address;
  created_at: string;
  user_wallet: Address;
  type: EContractEventType;
  isin?: string;
  nft_address?: string;
  nft_id?: string;
  principal?: string;
  wallet_from?: string;
  wallet_to?: string;

  dstEid?: TDestinationNetworkId;
  srcEid?: TDestinationNetworkId;
  guid?: string;
  log_index?: number;
  oft_status?: EOftStatus;
  tx_status?: string;
}

export interface IGetContractEventsRes extends IPagination {
  data: IContractEvent[];
}

export interface IGetContractBondsRes extends IPagination {
  data: IBond[];
  nft_stake: number;
  owned: number;
}

export interface IGetContractBondsMetadataRes extends IPagination {
  data: IBondMetadata[];
}

interface IMintAllowance {
  isin: string;
  nft_id: string;
  type: EContractEventType.MINT_ALLOWANCE_SET;
  user_wallet: string;
}

export interface IGetMintAllowanceRes extends IPagination {
  data: IMintAllowance[];
}

export interface IUsersMint {
  available_mint: string;
  country: string;
  coupon_value: string;
  currency: string;
  id: number;
  isin: string;
  issue_timestamp: string;
  maturity: string;
  nft_id: string;
  principal: string;
}

export interface IGetUsersMintRes extends IPagination {
  data: IUsersMint[];
  total_available_mint: string;
}

export interface IUsersActiveNft {
  nft_id: string;
  isin: string;
  principal: string;
  maturity: string;
  user_wallet: string;
  minted: string;
  nft_address: string;
  status: 'in correlator' | 'available';
  tx_hash: string;
}

export interface IGetUsersActiveNftRes extends IPagination {
  data: IUsersActiveNft[];
}
