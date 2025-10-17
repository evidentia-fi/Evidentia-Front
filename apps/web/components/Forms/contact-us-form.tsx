'use client';

import React from 'react';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { useModalState } from '@workspace/ui/stores/use-modal-state';

const ContactUsForm = () => {
  const { openComingSoon } = useModalState(s => ({ openComingSoon: s.openComingSoon }));

  return (
    <div className='mx-auto max-w-[604px] px-4'>
      <div className='bg-white/8 flex flex-col gap-8 rounded-xl border px-6 py-8 md:gap-10 md:p-12'>
        <div>
          <h1 className='mb-3 text-3xl font-bold md:text-5xl'>Contact us</h1>
          <p className='text-base md:text-2xl'>
            To contact us, please fill out and submit the feedback form.
          </p>
        </div>
        <Input placeholder='Name' className='text-white' />
        <Input placeholder='Email' className='text-white' />
        <Textarea placeholder='Message' rows={5} className='h-[108px] max-h-[108px] text-white' />
        <Button size='2xl' onClick={openComingSoon}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ContactUsForm;
