import React from 'react';

import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';

type AmountInputProps = NumericFormatProps & {
  onMaxClick?: () => void;
  maxText?: string;
  label?: string;
};

const AmountInput = ({
  onMaxClick,
  maxText = 'MAX',
  className,
  label,
  ...rest
}: AmountInputProps) => {
  return (
    <div className='relative w-full'>
      {label && <p className='mb-1.5 text-sm text-gray-700'>{label}</p>}

      <NumericFormat
        customInput={Input}
        thousandSeparator
        allowNegative={false}
        allowLeadingZeros={false}
        placeholder='0.00'
        className={cn('bg-white pr-14', className)}
        {...rest}
      />
      {onMaxClick && (
        <Button
          type='button'
          variant='secondary'
          onClick={onMaxClick}
          className='absolute right-2 top-1/2 h-[22px] -translate-y-1/2 border bg-gray-50 px-2 py-0.5 lg:text-xs'
        >
          {maxText}
        </Button>
      )}
    </div>
  );
};

export default AmountInput;
