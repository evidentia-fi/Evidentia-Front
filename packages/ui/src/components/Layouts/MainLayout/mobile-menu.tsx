'use client';

import React, { useEffect } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Navigations from '@workspace/ui/components/Layouts/MainLayout/navigations';
import Logo from '@workspace/ui/components/logo';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { useLanguage } from '@workspace/ui/providers/language-provider';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

const MobileHeader = () => {
  const { t } = useTranslation();
  const { open, openModal, closeModal } = useModalState(s => ({
    open: s.open,
    openModal: s.openModal,
    closeModal: s.closeModal,
  }));
  const isOpen = open === Emodal.MobileMenu;

  const { language, changeLanguage } = useLanguage();

  const dropdownVariants = {
    hidden: { opacity: 0, y: -20, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isOpen]);

  return (
    <div className='relative w-full lg:hidden'>
      <header className='relative z-30 flex h-[56px] w-full items-center justify-between border-b bg-white px-4'>
        <Logo color='black' size={130} />
        <div className='flex items-center gap-2'>
          <Select onValueChange={changeLanguage} value={language}>
            <SelectTrigger
              className='h-auto gap-0.5 rounded-full bg-gray-100 px-3 py-1.5 font-medium'
              size='sm'
            >
              <SelectValue placeholder='' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='en'>ENG</SelectItem>
              <SelectItem value='uk'>UKR</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={() => {
              if (isOpen) {
                closeModal();
              } else {
                openModal(Emodal.MobileMenu);
              }
            }}
            className='rounded-full p-2 text-gray-600 hover:bg-gray-100'
            aria-label='Відкрити/Закрити меню'
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              variants={backdropVariants}
              initial='hidden'
              animate='visible'
              exit='hidden'
              onClick={closeModal}
              className='fixed inset-0 z-10 bg-black/20'
            />

            <motion.div
              variants={dropdownVariants}
              initial='hidden'
              animate='visible'
              exit='hidden'
              className='absolute left-0 top-full z-20 w-full overflow-hidden border-b bg-white'
            >
              <div className='flex flex-col gap-6 p-4'>
                <Select value='UA'>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a fruit'>
                      <span className='font-medium text-gray-900'>{t('MARKET')}</span>
                      <span>UA</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={'UA'}>UA</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Navigations onClick={closeModal} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileHeader;
