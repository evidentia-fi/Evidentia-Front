import { TFunction } from 'i18next';

export interface ILink {
  title: string;
  href: string;
}

export const Routes = {
  DASHBOARD: '/',
  STAKING: '/staking',
  BRIDGE: '/bridge',
  MINT: '/mint',
  GOVERNANCE: '/governance',
  COLLATERAL_HOLDERS: '/collateral-holders',
} as const;

export const getLinks = (t: TFunction): ILink[] => [
  { title: t('MENU.LINK.DASHBOARD'), href: Routes.DASHBOARD },
  { title: t('MENU.LINK.STAKING'), href: Routes.STAKING },
  { title: t('MENU.LINK.BRIDGE'), href: Routes.BRIDGE },
  { title: t('MENU.LINK.MINT'), href: Routes.MINT },
  { title: t('MENU.LINK.GOVERNANCE'), href: Routes.GOVERNANCE },
  { title: t('MENU.LINK.COLLATERAL_HOLDERS'), href: Routes.COLLATERAL_HOLDERS },
];
