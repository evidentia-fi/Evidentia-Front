'use client';

import React, { useMemo } from 'react';

import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { CartesianGrid, Label, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardTitle } from '@workspace/ui/components/card';
import { ChartConfig, ChartContainer } from '@workspace/ui/components/chart';
import { useGetApy } from '@workspace/ui/hooks';
import CustomTooltip from '@workspace/ui/modules/Charts/custom-tooltip';
import { useLanguage } from '@workspace/ui/providers/language-provider';
import { useStable } from '@workspace/ui/providers/stable-provider';

import { formatShortNumber, localeDate } from '@workspace/utils/constants';

const SupplyChart = () => {
  const { t } = useTranslation();
  const { data } = useGetApy();
  const { symbol } = useStable();

  const { language } = useLanguage();

  const chartData = useMemo(() => {
    if (!data) return [];

    return data.apy_data.map(item => ({
      name: format(item.week_start, 'MMM dd', { locale: localeDate[language] }),
      fullDate: format(item.week_start, 'd MMMM', { locale: localeDate[language] }),
      total_supply: Number(item.avg_total_borrowed),
    }));
  }, [data, language]);

  const chartConfig = {} satisfies ChartConfig;

  return (
    <Card>
      <CardTitle>{t('SUPPLY_CHART.TITLE')}</CardTitle>

      <ChartContainer config={chartConfig} className='h-[220px] w-full'>
        <LineChart accessibilityLayer data={chartData}>
          <CartesianGrid strokeDasharray='0' vertical={false} />
          <YAxis
            dataKey='total_supply'
            tickFormatter={v => formatShortNumber(v)}
            interval={0}
            className='text-xs font-normal'
            label={{
              className: 'font-inter fill-gray-700 font-medium',
              value: symbol,
              style: { textAnchor: 'middle', fontWeight: 500 },
              angle: -90,
              position: 'left',
              offset: 0,
            }}
            allowDataOverflow={true}
            strokeWidth={0}
          />
          <XAxis dataKey='name' strokeWidth={0}>
            <Label
              value={t('CHART.DATE')}
              offset={-3}
              position='insideBottom'
              className='font-inter fill-gray-700 font-medium'
            />
          </XAxis>
          <Line
            type='monotone'
            dataKey='total_supply'
            stroke='var(--color-blue-700)'
            strokeWidth={2}
            dot={false}
          />
          <Tooltip content={<CustomTooltip />} />
        </LineChart>
      </ChartContainer>
    </Card>
  );
};

export default SupplyChart;
