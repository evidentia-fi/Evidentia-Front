'use client';

import React, { useEffect } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@workspace/ui/components/button';
import { useAccount } from '@workspace/ui/providers/account-provider';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

import WalletsInfo from './wallets-info';

const MobileWalletSheet = () => {
  const { t } = useTranslation();
  const { connect } = useAccount();
  const { open, closeModal } = useModalState(s => ({
    open: s.open,
    closeModal: s.closeModal,
  }));

  const isOpen = open === Emodal.MobileWalletInfo;

  const sheetVariants = {
    hidden: { y: '100%' },
    visible: { y: '0%', transition: { type: 'spring', damping: 25, stiffness: 150 } },
    exit: { y: '100%', transition: { duration: 0.2 } },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalStyle;
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            onClick={closeModal}
            className='fixed inset-0 z-40 bg-black/20'
          />

          <motion.div
            variants={sheetVariants}
            initial='hidden'
            animate='visible'
            exit='hidden'
            className='fixed inset-0 top-[108px] z-50 flex flex-col bg-white'
          >
            <div className='flex flex-shrink-0 items-center justify-between p-4'>
              <h3 className='text-xl font-medium'>{t('WALLET_INFO.TITLE')}</h3>
              <button
                onClick={closeModal}
                className='rounded-full p-1 text-gray-500 hover:bg-gray-100'
              >
                <X size={24} />
              </button>
            </div>

            <Button className='mx-4' size='md' onClick={connect}>
              {t('ACCOUNT.WALLETS')}
            </Button>

            <div className='flex-grow overflow-y-auto p-4'>
              <WalletsInfo variant='mobile' />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileWalletSheet;
