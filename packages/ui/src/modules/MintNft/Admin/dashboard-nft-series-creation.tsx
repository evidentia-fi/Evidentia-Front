import React from 'react';

import { Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@workspace/ui/components/button';
import { Card, CardTitle } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import BondNftSeriesCreationTable from '@workspace/ui/modules/Tables/bond_nft_series_creation';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

const DashboardNftSeriesCreation = () => {
  const { t } = useTranslation();
  const [search, setSearch] = React.useState('');

  const { openModal } = useModalState(s => ({
    openModal: s.openModal,
  }));

  return (
    <Card>
      <div className='flex items-center justify-between'>
        <CardTitle>{t('DASHBOARD.CARDS.BOND_NFT_SERIES_CREATION')}</CardTitle>
        <div className='flex gap-2'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2' />
            <Input
              placeholder={'e.g UA4000200000'}
              className='pl-10'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button size='lg' onClick={() => openModal(Emodal.CreateBond)}>
            {t('BUTTON.CREATE_NFT_SERIES')} <Plus />
          </Button>
        </div>
      </div>

      <BondNftSeriesCreationTable search={search} />
    </Card>
  );
};

export default DashboardNftSeriesCreation;
