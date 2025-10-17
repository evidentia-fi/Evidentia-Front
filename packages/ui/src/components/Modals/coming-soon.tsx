import React from 'react';

import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@workspace/ui/components/dialog';
import { useModalState } from '@workspace/ui/stores/use-modal-state';

const ComingSoon = () => {
  const { closeModal } = useModalState(s => ({ closeModal: s.closeModal }));

  return (
    <Dialog open={true} onOpenChange={closeModal}>
      <DialogContent className='bg-black/6 w-full max-w-full p-14 text-white max-md:h-full max-md:rounded-none max-md:px-4 max-md:pb-6 sm:max-w-[704px]'>
        <div className='hidden max-md:block' />
        <div className='flex flex-col'>
          <DialogTitle className='mb-3 text-3xl font-bold sm:mb-6 sm:text-6xl'>
            Coming soon
          </DialogTitle>
          <p className='sm:text-xl'>
            Dashboard is under development and will be available soon. Stay tuned for updates.
          </p>
        </div>
        <DialogFooter className={'sm:mt-10 sm:justify-start'}>
          <Button onClick={closeModal}>Understood</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComingSoon;
