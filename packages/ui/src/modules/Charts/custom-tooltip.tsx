import React from 'react';

import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const fullDate = (payload?.[0]?.payload as any)?.fullDate as string;
  return (
    <div className='rounded border border-gray-200 bg-white p-3 shadow'>
      <p className='mb-1 text-sm font-semibold'>{fullDate}</p>
      <ul className='space-y-1 text-xs'>
        {payload.map((entry, index) => (
          <li key={`tooltip-item-${index}`} className='text-gray-700'>
            <span
              className='mr-2 inline-block h-2 w-2 rounded-full'
              style={{ backgroundColor: entry.color || '#8884d8' }}
            ></span>
            <span className='capitalize'>{entry.name?.toString().replaceAll('_', ' ')}</span>:{' '}
            <strong>{entry.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomTooltip;
