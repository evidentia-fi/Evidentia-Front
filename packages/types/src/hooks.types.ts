import { EBondStatus, EContractEventType } from './contract_apy.types';
import { IPaginationProps } from './pagination.types';

export interface IUseGetEventsProps extends IPaginationProps {
  types?: EContractEventType[];
  wallet?: string;
}

export interface IUseGetBondsProps extends IPaginationProps {
  wallet?: string;
  status?: EBondStatus;
}

export interface IUseGetUserMintProps extends IPaginationProps {
  wallet?: string;
}
