import axios, { AxiosInstance } from 'axios';

import { env } from '../config';

export const API_URL = `${env.API_BASE_URL}api/v1`;

export enum API {
  EVENTS = '/contract/events',
  APY = '/contract/apy',
  BONDS = '/contract/bonds',
  BONDS_METADATA = '/contract/bonds_metadata',
  MINT_ALLOWANCE = '/contract/mint-allowance',
  USERS_MINT = '/contract/users-mint',
  USERS_ACTIVE_NFT = '/contract/users-active-nft',
  USERS_REDEEMED_NFT = '/contract/users-redeemed-nft',
}

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    ContentType: 'application/json',
  },
});
