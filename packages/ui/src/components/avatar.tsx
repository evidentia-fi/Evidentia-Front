'use client';

import * as React from 'react';

import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '@workspace/ui/lib/utils';

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot='avatar'
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot='avatar-image'
      className={cn('aspect-square size-full', className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot='avatar-fallback'
      className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)}
      {...props}
    />
  );
}

export interface GroupAvatarProps {
  avatars: { name: string; image: string }[];
  maxDisplayed?: number;
  size?: string; // e.g., 'h-8 w-8'
  className?: string; // For the container div
}

const GroupAvatar: React.FC<GroupAvatarProps> = ({
  maxDisplayed = 3,
  size = 'h-5 w-5', // Default size
  className,
  avatars = [],
}) => {
  const displayedUsers = avatars.slice(0, maxDisplayed);
  const remainingCount = avatars.length - displayedUsers.length;

  return (
    <div
      className={cn(className, 'text-brand-700 flex items-center -space-x-2 text-xs font-medium')}
    >
      {displayedUsers.map((user, index) => (
        <Avatar key={index} className={cn(size)}>
          <AvatarImage src={user.image} alt={user.name} className='bg-white' />
          <AvatarFallback className='border-3 border-brand-200'>
            {user.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <Avatar className={cn(size)}>
          <AvatarFallback className='border-3 border-brand-200'>+{remainingCount}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export { Avatar, AvatarImage, AvatarFallback, GroupAvatar };
