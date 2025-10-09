import React from 'react';

import { Minus, Plus } from 'lucide-react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { cn } from '@workspace/ui/lib/utils';

type NumberInputProps = NumericFormatProps & {
  handleIncrement?: () => void;
  handleDecrement?: () => void;
  classNameWrapper?: string;
};

const NumberInput = ({
  className,
  handleIncrement,
  handleDecrement,
  classNameWrapper,
  ...rest
}: NumberInputProps) => {
  return (
    <div className={cn('relative w-full', classNameWrapper)}>
      <NumericFormat
        customInput={Input}
        thousandSeparator
        decimalScale={0}
        allowNegative={false}
        placeholder='0.00'
        className={cn('pr-20', className)}
        {...rest}
      />
      {(handleIncrement || handleDecrement) && (
        <div className='absolute right-2 top-1/2 -translate-y-1/2 space-x-1'>
          {handleDecrement && (
            <Button
              type='button'
              variant='secondary'
              size='iconSm'
              className='bg-gray-50 px-2 py-0.5 lg:text-xs'
              onClick={handleDecrement}
            >
              <Minus />
            </Button>
          )}
          {handleIncrement && (
            <Button
              type='button'
              variant='secondary'
              size='iconSm'
              className='bg-gray-50 px-2 py-0.5 lg:text-xs'
              onClick={handleIncrement}
            >
              <Plus />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default NumberInput;
