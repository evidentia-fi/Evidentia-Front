import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import {
  EContractEventType,
  IPaginationWithFilterProps,
  IUseGetBondsProps,
  IUseGetEventsProps,
  IUseGetUserMintProps,
} from '@workspace/types';

import { useContractServices } from '@workspace/ui/providers/contract-service-provider';

import { queryClient } from '@workspace/utils/config';
import { mutationKey, queryKeys, refetchInterval } from '@workspace/utils/constants';

export const useGetEvents = ({ perPage, page, types, wallet }: IUseGetEventsProps) => {
  const contractServices = useContractServices();
  const walletQuery = wallet ? `&user_wallet=${wallet}` : '';
  const typeQuery = types ? `&type=${types.map(type => type).join('-')}` : '';
  const url = `${typeQuery}${walletQuery}`;

  return useQuery({
    queryKey: [queryKeys.events, page, url],
    queryFn: () => contractServices.getEvents({ perPage, page, url }),
    select: ({ data }) => {
      const processedData = data.data.map(event => {
        // if (
        //   event.type === 'stable_transfer' &&
        //   event.wallet_to?.toLowerCase() === wallet?.toLowerCase()
        // ) {
        //   return { ...event, type: EContractEventType.STABLE_WITHDRAW };
        // }
        // if (
        //   event.type === 'stable_transfer' &&
        //   event.wallet_from?.toLowerCase() === wallet?.toLowerCase()
        // ) {
        //   return { ...event, type: EContractEventType.STABLE_STAKE };
        // }
        return event;
      });
      return { ...data, data: processedData };
    },
    placeholderData: keepPreviousData,
    refetchInterval,
  });
};

export const updateEvents = () => {
  const contractServices = useContractServices();
  return useMutation({
    mutationKey: [...queryKeys.update_events],
    mutationFn: contractServices.updateEvents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] }).then();
      queryClient.invalidateQueries({ queryKey: [queryKeys.bonds] }).then();
      queryClient.invalidateQueries({ queryKey: [queryKeys.users_mint] }).then();
    },
  });
};

export const useGetApy = () => {
  const contractServices = useContractServices();
  return useQuery({
    queryKey: [queryKeys.apy],
    queryFn: contractServices.getAPY,
    select: ({ data }) => data,
  });
};

export const useGetBonds = ({ perPage, page, wallet, status }: IUseGetBondsProps) => {
  const contractServices = useContractServices();
  const walletQuery = wallet ? `&user_wallet=${wallet}` : '';
  const statusQuery = status ? `&status=${status}` : '';
  const url = `${statusQuery}${walletQuery}`;

  return useQuery({
    queryKey: [queryKeys.bonds, page, url],
    queryFn: () => contractServices.getBonds({ perPage, page, url }),
    select: ({ data }) => data,
    placeholderData: keepPreviousData,
    refetchInterval,
  });
};

export const useUserMint = ({ perPage, page, wallet }: IUseGetUserMintProps) => {
  const contractServices = useContractServices();
  const walletQuery = wallet ? `&user_wallet=${wallet}` : '';
  const url = `${walletQuery}`;

  return useQuery({
    queryKey: [queryKeys.users_mint, url, page, perPage],
    queryFn: () => contractServices.getUserMint({ perPage, page, url }),
    select: ({ data }) => data,
    placeholderData: keepPreviousData,
    refetchInterval,
    enabled: !!wallet,
  });
};

export const useUsersNft = ({
  perPage,
  page,
  wallet,
  type,
}: IUseGetUserMintProps & {
  enabled?: boolean;
  type?: 'active' | 'redeemed';
}) => {
  const contractServices = useContractServices();
  const walletQuery = wallet ? `&user_wallet=${wallet}` : '';
  const url = `${walletQuery}`;

  const queryKey = [
    type === 'active' ? queryKeys.users_active_nft : queryKeys.users_redeemed_nft,
    url,
    page,
    perPage,
  ];

  const queryFn =
    type === 'active'
      ? () => contractServices.getUsersActiveNft({ perPage, page, url })
      : () => contractServices.getUsersRedeemedNft({ perPage, page, url });

  return useQuery({
    queryKey,
    queryFn,
    select: ({ data }) => data,
    placeholderData: keepPreviousData,
    refetchInterval,
    enabled: !!wallet,
  });
};

export const useUpdateBonds = () => {
  const contractServices = useContractServices();

  return useMutation({
    mutationKey: [mutationKey.bonds_update],
    mutationFn: (url: string) => contractServices.undateBonds(url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.bonds] }).then();
    },
  });
};

export const useMintAllowance = ({ perPage, page }: IUseGetBondsProps) => {
  const contractServices = useContractServices();

  return useQuery({
    queryKey: [queryKeys.mint_allowance, page],
    queryFn: () => contractServices.getMintAllowance({ perPage, page }),
    select: ({ data }) => data,
    placeholderData: keepPreviousData,
    refetchInterval,
  });
};

export const useGetBondsMetadata = ({ perPage, page, url }: IPaginationWithFilterProps) => {
  const contractServices = useContractServices();
  const urlQuery = url ? `&${url}` : '';

  return useQuery({
    queryKey: [queryKeys.bonds_metadata, page, urlQuery],
    queryFn: () => contractServices.getBondsMetadata({ perPage, page, url: urlQuery }),
    select: ({ data }) => data,
    placeholderData: keepPreviousData,
    refetchInterval,
  });
};
