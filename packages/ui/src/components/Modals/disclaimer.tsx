import React, { useState } from 'react';

import { DialogTitle } from '@radix-ui/react-dialog';
import { getCookie, setCookie } from 'cookies-next';

import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogFooter } from '@workspace/ui/components/dialog';

const Disclaimer = () => {
  const isFirstVisit =
    getCookie('isFirstVisit') === 'true' || getCookie('isFirstVisit') === undefined;

  const [open, setOpen] = useState(isFirstVisit);

  const handleClose = () => {
    setCookie('isFirstVisit', 'false', { maxAge: 60 * 60 * 24 * 365 }); // Set cookie for 1 year
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='bg-black/6 w-full max-w-full p-14 text-white max-md:h-full max-md:rounded-none max-md:px-4 max-md:pb-6 sm:max-w-[704px]'>
        <div className='flex flex-col'>
          <DialogTitle className='hidden' />
          <p className='sm:text-xl'>
            This site is graphic representation of interface for interaction with public
            smartcontracts, freely available on the blockchain. The information contained on the
            Site is not intended to solicit you to purchase any financial product. Tokenized
            financial assets are NOT offered on this site or by any affiliated entity of ours
            directly to the public and are available only to “Qualified" and "Proffesional"
            investors. Tokens and tokenized financial assets have not been and will not be
            registered under the U.S. Securities Act of 1933 or with any securities regulatory
            authority of any State or other jurisdiction of the U.S and (i) may not be offered, sold
            or delivered within the U.S to, or for the account or benefit of U.S. Persons and any UK
            Clients. There may be advertisement information on this site.
          </p>
        </div>
        <DialogFooter className={'sm:mt-10 sm:justify-start'}>
          <Button className='w-full' size='xl' onClick={handleClose}>
            I UNDERSTAND
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Disclaimer;
