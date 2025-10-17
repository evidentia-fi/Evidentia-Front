import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import { getServerT } from '@workspace/i18n/serverI18n';

import DashboardContent from '@workspace/ui/modules/Dashboard/dashboard-content';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const cookieStore = await cookies();
  const cookieLang = cookieStore.get('i18next')?.value ?? 'uk';
  const t = await getServerT(cookieLang);
  const { tab } = await searchParams;
  const selectTab = (tab ?? 'main') as string;
  const cTab = t(`DASHBOARD.TAB.${selectTab.toUpperCase()}`);
  const title = `${t('MENU.LINK.DASHBOARD')} | ${cTab}`;

  return {
    title,
  };
}

const Page = () => {
  return <DashboardContent />;
};

export default Page;
