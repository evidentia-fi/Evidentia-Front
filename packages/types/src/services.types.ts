import { AxiosResponse } from 'axios';

import {
  IGetApyRes,
  IGetContractBondsMetadataRes,
  IGetContractBondsRes,
  IGetContractEventsRes,
  IGetMintAllowanceRes,
  IGetUsersActiveNftRes,
  IGetUsersMintRes,
} from './contract_apy.types';
import { IPaginationProps, IPaginationWithFilterProps } from './pagination.types';

export interface IContractServiceAPI {
  getEvents: (props: IPaginationWithFilterProps) => Promise<AxiosResponse<IGetContractEventsRes>>;
  updateEvents: () => Promise<AxiosResponse<IGetContractEventsRes>>;
  getAPY: () => Promise<AxiosResponse<IGetApyRes>>;
  getBonds: (props: IPaginationWithFilterProps) => Promise<AxiosResponse<IGetContractBondsRes>>;
  getBondsMetadata: (
    props: IPaginationWithFilterProps,
  ) => Promise<AxiosResponse<IGetContractBondsMetadataRes>>;
  getMintAllowance: (props: IPaginationProps) => Promise<AxiosResponse<IGetMintAllowanceRes>>;
  getUserMint: (props: IPaginationWithFilterProps) => Promise<AxiosResponse<IGetUsersMintRes>>;
  getUsersActiveNft: (
    props: IPaginationWithFilterProps,
  ) => Promise<AxiosResponse<IGetUsersActiveNftRes>>;
  getUsersRedeemedNft: (
    props: IPaginationWithFilterProps,
  ) => Promise<AxiosResponse<IGetUsersActiveNftRes>>;
  undateBonds: (url: string) => Promise<AxiosResponse<void>>;
}
