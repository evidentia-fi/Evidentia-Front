import type { Metadata } from 'next';

import DashboardContent from '@workspace/ui/modules/Dashboard/dashboard-content';

export const metadata: Metadata = {
  title: 'Evidentia | Dashboard',
};

const Page = () => {
  return <DashboardContent />;
};

export default Page;
