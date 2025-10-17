import { IContractServiceAPI } from '@workspace/types';

import { API, api } from '../utils';

export const contractServices: IContractServiceAPI = {
  getEvents: async ({ perPage, page, url }) =>
    api.get(`${API.EVENTS}?page_number=${page}&page_size=${perPage}${url}`),
  updateEvents: async () => api.post(API.EVENTS, { api_key: 'test_key' }),
  getAPY: async () => api.get(`${API.APY}`),
  getBonds: async ({ perPage, page, url }) =>
    api.get(`${API.BONDS}?page_number=${page}&page_size=${perPage}${url}`),
  getBondsMetadata: async ({ perPage, page, url }) =>
    api.get(`${API.BONDS_METADATA}?page_number=${page}&page_size=${perPage}${url}`),
  getMintAllowance: async ({ perPage, page }) =>
    api.get(`${API.MINT_ALLOWANCE}?page_number=${page}&page_size=${perPage}`),
  getUserMint: async ({ perPage, page, url }) =>
    api.get(`${API.USERS_MINT}?page_number=${page}&page_size=${perPage}${url}`),
  getUsersActiveNft: async ({ perPage, page, url }) =>
    api.get(`${API.USERS_ACTIVE_NFT}?page_number=${page}&page_size=${perPage}${url}`),
  getUsersRedeemedNft: async ({ perPage, page, url }) =>
    api.get(`${API.USERS_REDEEMED_NFT}?page_number=${page}&page_size=${perPage}${url}`),
  undateBonds: async (url: string) => api.post(`${API.BONDS}?${url}`),
};
