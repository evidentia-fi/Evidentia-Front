import * as React from 'react';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar } from '@workspace/ui/components/calendar';

import { cn } from '../lib/utils';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface IDatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
}

export function DatePicker({ className, date, setDate, placeholder }: IDatePickerWithRangeProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            size='md'
            variant='secondary'
            className={cn(
              'relative justify-between text-left font-normal',
              !date && 'text-gray-500',
            )}
          >
            <span className='flex items-center gap-2'>
              <CalendarIcon />
              {date ? format(date, 'PPP') : <span>{placeholder ?? 'Pick a date'}</span>}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar mode={'single'} selected={date} onSelect={setDate} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
