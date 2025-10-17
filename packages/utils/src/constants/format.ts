import i18n from '@workspace/i18n/i18n';
import { EContractEventType, Language } from '@workspace/types';
import { Locale, enUS, uk } from 'date-fns/locale';
import { NumericFormatProps, numericFormatter } from 'react-number-format';

export const formatDateStr = 'yyyy-MM-dd';
export const formatDateWithTimeStr = 'yyyy-MM-dd HH:mm:ss';

export const localeDate: { [k in Language]: Locale } = {
  uk,
  en: enUS,
};

export const numberFormat = (
  value?: string | number,
  decimal: number | 'auto' = 2,
  options?: NumericFormatProps,
) => {
  if (value === undefined || value === null || value === '') return '0';

  const valueStr = String(value).trim();

  const decimalScale =
    decimal === 'auto'
      ? (() => {
          const [, dec = ''] = valueStr.split('.');
          return /^0*$/.test(dec) ? 0 : dec.length;
        })()
      : decimal;

  return numericFormatter(valueStr, {
    thousandSeparator: ',',
    decimalScale,
    ...options,
  });
};

export const formatShortNumber = (number?: number | bigint, locale = 'en') => {
  if (!number) return '0';

  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(number);
};

export const shortAddress = (address?: string | null) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getContractEventTypeText = (type: EContractEventType): string => {
  switch (type) {
    case EContractEventType.BORROW:
      return i18n?.t('CONTRACT_EVENT.MINT');
    case EContractEventType.MINT:
      return i18n?.t('CONTRACT_EVENT.MINT');
    case EContractEventType.NFT_STAKE:
      return i18n?.t('CONTRACT_EVENT.NFT_STAKE');
    case EContractEventType.REPAY:
      return i18n?.t('CONTRACT_EVENT.REPAY');
    case EContractEventType.NFT_TRANSFER:
      return i18n?.t('CONTRACT_EVENT.NFT_TRANSFER');
    case EContractEventType.REWARD_CLAIM:
      return i18n?.t('CONTRACT_EVENT.REWARD_CLAIM');
    case EContractEventType.STABLE_STAKE:
      return i18n?.t('CONTRACT_EVENT.STABLE_STAKE');
    case EContractEventType.STABLE_WITHDRAW:
      return i18n?.t('CONTRACT_EVENT.STABLE_WITHDRAW');
    case EContractEventType.STABLE_TRANSFER:
      return i18n?.t('CONTRACT_EVENT.STABLE_TRANSFER');
    case EContractEventType.NFT_UNSTAKE:
      return i18n?.t('CONTRACT_EVENT.NFT_UNSTAKE');
    case EContractEventType.OFT_RECEIVED:
      return i18n?.t('CONTRACT_EVENT.OFT_RECEIVED');
    case EContractEventType.OFT_SEND:
      return i18n?.t('CONTRACT_EVENT.OFT_SEND');
    default:
      return '';
  }
};

export const destinationNetworkName = {
  30420: 'Tron',
  40420: 'Tron',
  40161: 'Sepolia',
  30101: 'Ethereum',
};
