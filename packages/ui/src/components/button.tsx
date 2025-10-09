import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import { BeatLoader } from 'react-spinners';

import { cn } from '@workspace/ui/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm lg:text-base font-medium transition-[color,box-shadow] cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-brand-600 text-white shadow-xs hover:bg-brand-700',
        secondary:
          'border border-input bg-white/8 shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondaryColor:
          'border border-brand-200 bg-gray-25 shadow-xs text-brand-600 hover:bg-gray-100 hover:text-brand-800 hover:border-brand-300',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-brand-600 underline underline-offset-4 hover:underline !p-0 !h-auto font-normal hover:text-brand-700',
      },
      size: {
        default: 'h-9 px-3.5 py-2 rounded-md',
        sm: 'h-8 rounded-md gap-1.5 px-3 py-2 has-[>svg]:px-2.5 text-sm lg:text-sm',
        md: 'h-10 rounded-md px-3.5 py-2.5 has-[>svg]:px-4 text-sm lg:text-sm',
        lg: 'h-11 rounded-md px-4 py-3 has-[>svg]:px-4',
        xl: 'h-12 rounded-md px-4.5 py-3.5 has-[>svg]:px-4',
        '2xl': 'h-[60px] rounded-lg px-4.5 py-5.5 has-[>svg]:px-4 text-lg lg:text-lg',
        icon: 'size-10 rounded-md',
        iconSm: 'size-8 rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

function Button({
  className,
  variant,
  size,
  isLoading,
  disabled,
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  const colorByVariant = {
    default: 'var(--color-white)',
    secondary: 'var(--color-gray-900)',
    secondaryColor: 'var(--color-brand-600)',
    ghost: 'text-accent-foreground',
    link: 'text-brand-600 underline underline-offset-4 font-normal',
  };

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <BeatLoader color={variant ? colorByVariant[variant] : 'var(--color-white)'} size={10} />
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
