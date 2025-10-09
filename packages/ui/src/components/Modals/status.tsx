'use client';

import React from 'react';

import { CircleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Dialog, DialogContent, DialogTitle } from '@workspace/ui/components/dialog';
import { cn } from '@workspace/ui/lib/utils';
import { EStatus, useModalState } from '@workspace/ui/stores/use-modal-state';

const StatusModal = () => {
  const { t } = useTranslation();
  const { closeModal, args } = useModalState(s => ({ closeModal: s.closeModal, args: s.args }));

  const statusData: {
    [k in EStatus]: {
      bg: string;
      icon: string;
      title: string;
      desc: string;
    };
  } = {
    success: {
      bg: 'bg-success-100',
      icon: 'stroke-success-600',
      title: t('MODAL.STATUS.SUCCESS_TITLE'),
      desc: t('MODAL.STATUS.SUCCESS_DESC'),
    },
    failed: {
      bg: 'bg-error-100',
      icon: 'stroke-error-600',
      title: t('MODAL.STATUS.ERROR_TITLE'),
      desc: t('MODAL.STATUS.ERROR_DESC'),
    },
    confirm: {
      bg: 'bg-blue-100',
      icon: 'stroke-blue-600',
      title: t('MODAL.STATUS.CONFIRM_TITLE'),
      desc: t('MODAL.STATUS.CONFIRM_DESC'),
    },
    pending: {
      bg: 'bg-yellow-100',
      icon: 'stroke-yellow-600',
      title: t('MODAL.STATUS.PENDING_TITLE'),
      desc: t('MODAL.STATUS.PENDING_DESC'),
    },
  };

  if (!args.status) {
    return null;
  }
  
  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='w-full lg:max-w-[400px]'>
        <div className='flex w-full flex-col items-center gap-1'>
          <div
            className={cn(
              'mb-4 flex size-12 items-center justify-center rounded-full',
              statusData[args.status!].bg,
            )}
          >
            <CircleAlert size={24} className={statusData[args.status!].icon} />
          </div>
          <DialogTitle className='text-lg font-semibold text-gray-900'>
            {statusData[args.status!].title}
          </DialogTitle>
          <p className='text-center text-sm text-gray-600'> {statusData[args.status!].desc}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusModal;
