'use client';

import React from 'react';

import { useTranslation } from 'react-i18next';

import StatusModal from '@workspace/ui/components/Modals/status';
import { Dialog, DialogContent, DialogTitle } from '@workspace/ui/components/dialog';
import CreateBondForm from '@workspace/ui/modules/Forms/create-bond';
import { useModalState } from '@workspace/ui/stores/use-modal-state';

const CreateBondModal = () => {
  const { t } = useTranslation();
  const { closeModal, status } = useModalState(s => ({
    closeModal: s.closeModal,
    status: s.args.status,
  }));

  if (status) {
    return <StatusModal />;
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='w-full lg:max-w-[400px]'>
        <DialogTitle className='text-center text-lg font-semibold text-gray-900'>
          {t('MODAL.CREATE_BOND.TITLE')}
        </DialogTitle>
        <CreateBondForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateBondModal;
