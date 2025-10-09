import {
  EBondStatus,
  EContractEventType,
  IBond,
  IBondMetadata,
  IContractEvent,
  IContractServiceAPI,
  IGetApyRes,
  IGetContractBondsMetadataRes,
  IGetContractBondsRes,
  IGetContractEventsRes,
  IPaginationProps,
  IPaginationWithFilterProps,
} from '@workspace/types';
import { AxiosResponse } from 'axios';

const allMockSolEvents: IContractEvent[] = [
  {
    amount: '8',
    created_at: '2025-05-08T11:21:18.310533',
    nft_address: '0xB4Fb3193a399b2aA8D488E76F583AD9dc61F005f',
    type: EContractEventType.NFT_UNSTAKE,
    id: 1564,
    nft_id: '75955146522550863186049403197281544413786813629915328080343312216854220103147',
    user_wallet: '0x4E66D91d5195E94717Ba849BBC9C23C87315d78d',
    principal: '1000000000',
    tx_hash: '0x33425f6e5a0bed23bfe547ac7ccc954d922192228c6e44417772f8ff5ea68d06',
    isin: 'UA4000235378',
  },
  {
    amount: '2000',
    created_at: '2025-05-08T10:30:06.617302',
    nft_address: '0xB4Fb3193a399b2aA8D488E76F583AD9dc61F005f',
    type: EContractEventType.NFT_UNSTAKE,
    id: 1561,
    nft_id: '75955146522550863186049403197281544413786813629915328080343312216854220103147',
    user_wallet: '0x4E66D91d5195E94717Ba849BBC9C23C87315d78d',
    principal: '1000000000',
    tx_hash: '0xbb1174a2bb36bfa1281d0e822064e5104f5e05a44722e8172186aed9c2c61b62',
    isin: 'UA4000235378',
  },
  {
    amount: '100',
    created_at: '2025-05-08T08:49:03.580437',
    nft_address: '0xB4Fb3193a399b2aA8D488E76F583AD9dc61F005f',
    type: EContractEventType.NFT_UNSTAKE,
    id: 1551,
    nft_id: '75955146522550863186049403197281544413786813629915328080343312216854220103147',
    user_wallet: '0x4E66D91d5195E94717Ba849BBC9C23C87315d78d',
    principal: '1000000000',
    tx_hash: '0x711671445571fe44cc37d0583f9b782b7a7984ec73a6f6f9acd495d59a0ffc56',
    isin: 'UA4000235378',
  },
];

const allMockSolBonds: IBond[] = [
  {
    number: '190.00',
    created_at: '2025-05-08T08:39:54.492667',
    nft_id: '75955146522550863186049403197281544413786813629915328080343312216854220103147',
    country: 'Ukraine',
    principal: '1000.00',
    coupon_value: '81650000.00',
    status: EBondStatus.NFT_STAKE,
    isin: 'UA4000235378',
    id: 12,
    user_wallet: '0x4E66D91d5195E94717Ba849BBC9C23C87315d78d',
    currency: 'eUAH',
    issue_timestamp: '2025-04-29T00:00:00',
    maturity: '2026-08-19T00:00:00',
    bond_id: 12,
    collateral_value: 123654.456,
  },
];
const allMockSolBondsMetadata: IBondMetadata[] = [
  {
    nft_id: '75955146522550863186049403197281544413786813629915328080343312216854220103147',
    country: 'Ukraine',
    principal: '1000.00',
    coupon_value: '81650000.00',
    isin: 'UA4000235378',
    id: 12,
    currency: 'eUAH',
    issue_timestamp: '2025-04-29T00:00:00',
    maturity: '2026-08-19T00:00:00',
    collateral_value: 123654.456,
    nft_count: 1,
  },
];

export const solContractServicesMock: IContractServiceAPI = {
  getEvents: async ({ perPage = 10, page = 1, url }: IPaginationWithFilterProps) => {
    const responseData: IGetContractEventsRes = {
      data: allMockSolEvents,
      total_results: allMockSolEvents.length,
      page_number: page,
      page_size: perPage,
      num_pages: 1,
    };

    return Promise.resolve<AxiosResponse<IGetContractEventsRes>>({
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config: { url: `/mock/sol/events?page_number=${page}&page_size=${perPage}${url}` } as any,
    });
  },

  updateEvents: async () => {
    const responseData: IGetContractEventsRes = {
      data: allMockSolEvents.slice(0, 10),
      total_results: allMockSolEvents.length,
      page_number: 1,
      page_size: 1,
      num_pages: 1,
    };
    return Promise.resolve<AxiosResponse<IGetContractEventsRes>>({
      data: responseData,
      status: 201,
      statusText: 'Created',
      headers: { 'content-type': 'application/json' },
      config: { url: '/mock/sol/events/update' } as any,
    });
  },

  getAPY: async () => {
    console.log('[MOCK Solana] getAPY called');
    const responseData: IGetApyRes = {
      apy_data: [
        {
          week_start: '2025-04-28T00:00:00',
          avg_total_borrowed: '19598.9027',
          avg_total_supply: '2113520.8673',
          avg_protocol_apy: '12.00',
          avg_total_staked: '5445.7893',
          avg_total_collateral: '2117104.5311',
          avg_apy: '96.53',
        },
        {
          week_start: '2025-05-05T00:00:00',
          avg_total_borrowed: '2651511.4281',
          avg_total_supply: '4041853.6914',
          avg_protocol_apy: '12.00',
          avg_total_staked: '1061961.7732',
          avg_total_collateral: '4041853.6914',
          avg_apy: '65.77',
        },
        {
          week_start: '2025-05-12T00:00:00',
          avg_total_borrowed: '4445073.6572',
          avg_total_supply: '5335390.0560',
          avg_protocol_apy: '12.00',
          avg_total_staked: '1507509.8486',
          avg_total_collateral: '5335390.0560',
          avg_apy: '35.38',
        },
      ],
      issuers: 6,
      holders: 369,
      total_staked_nft: 5193,
      total_borrowed: '4445818.3895',
      total_supply: '5336158.0275',
      protocol_apy: 12,
      total_staked: '1506909.9605',
      apy: 35.4,
      created_at: '2025-05-16T11:30:02.907360',
      total_collateral: '5336158.0275',
    };
    return Promise.resolve<AxiosResponse<IGetApyRes>>({
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config: { url: '/mock/sol/apy' } as any,
    });
  },

  getBonds: async ({ perPage = 10, page = 1, url }: IPaginationWithFilterProps) => {
    const responseData: IGetContractBondsRes = {
      data: allMockSolBonds,
      total_results: allMockSolBonds.length,
      page_number: page,
      page_size: perPage,
      num_pages: 1,
      nft_stake: 5202736,
      owned: 205513,
    };
    return Promise.resolve<AxiosResponse<IGetContractBondsRes>>({
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config: { url: `/mock/sol/bonds?page_number=${page}&page_size=${perPage}${url}` } as any,
    });
  },
  getBondsMetadata: async ({ perPage = 10, page = 1 }: IPaginationProps) => {
    const responseData: IGetContractBondsMetadataRes = {
      data: allMockSolBondsMetadata,
      total_results: allMockSolBondsMetadata.length,
      page_number: page,
      page_size: perPage,
      num_pages: 1,
    };
    return Promise.resolve<AxiosResponse<IGetContractBondsMetadataRes>>({
      data: responseData,
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config: { url: `/mock/sol/bonds?page_number=${page}&page_size=${perPage}` } as any,
    });
  },
  undateBonds: async () => {
    return Promise.resolve<AxiosResponse>({
      data: [],
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config: { url: `/mock/sol/undateBonds?` } as any,
    });
  },
  getMintAllowance: async ({}: IPaginationProps) => {
    return Promise.resolve<AxiosResponse>({
      data: [],
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config: { url: `/mock/sol/undateBonds?` } as any,
    });
  },
  getUserMint: async ({ perPage = 10, page = 1 }: IPaginationWithFilterProps) => {
    return Promise.resolve<AxiosResponse>({
      data: [],
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config: { url: `/mock/sol/userMint?page_number=${page}&page_size=${perPage}` } as any,
    });
  },
  getUsersActiveNft: async ({ perPage = 10, page = 1 }: IPaginationWithFilterProps) => {
    return Promise.resolve<AxiosResponse>({
      data: [],
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config: { url: `/mock/sol/usersActiveNft?page_number=${page}&page_size=${perPage}` } as any,
    });
  },
  getUsersRedeemedNft: async ({ perPage = 10, page = 1 }: IPaginationWithFilterProps) => {
    return Promise.resolve<AxiosResponse>({
      data: [],
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config: { url: `/mock/sol/usersRedeemedNft?page_number=${page}&page_size=${perPage}` } as any,
    });
  },
};
