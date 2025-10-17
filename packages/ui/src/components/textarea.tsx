import * as React from 'react';

import { cn } from '@workspace/ui/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'file:text-foreground selection:bg-brand-600 dark:bg-input/30 border-input shadow-xs text-md flex h-11 min-h-16 w-full min-w-0 resize-none rounded-md border bg-transparent px-3 py-1 text-gray-900 outline-none transition-[color,box-shadow] selection:text-white file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
