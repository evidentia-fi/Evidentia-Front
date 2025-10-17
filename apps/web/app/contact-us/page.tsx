import React from 'react';

import Image from 'next/image';

import ContactUsForm from '@/components/Forms/contact-us-form';

const Page = () => {
  return (
    <div className='flex flex-1 items-center justify-center pt-20 text-white'>
      <Image src='/bg-contact-us.webp' fill alt='bg' className='-z-1' />

      <ContactUsForm />
    </div>
  );
};

export default Page;
