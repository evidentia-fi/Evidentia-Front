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

import { formatShortNumber, localeDate } from '@workspace/utils/constants';

const StakingApyChart = () => {
  const { t } = useTranslation();
  const { data } = useGetApy();
  const { language } = useLanguage();

  const chartData = useMemo(() => {
    if (!data) return [];

    return data.apy_data.map(item => ({
      name: format(item.week_start, 'MMM d', { locale: localeDate[language] }),
      fullDate: format(item.week_start, 'd MMMM', { locale: localeDate[language] }),
      apy: Number(item.avg_apy),
    }));
  }, [data, language]);

  console.log({ chartData });

  const chartConfig = {} satisfies ChartConfig;

  return (
    <Card>
      <CardTitle>{t('STAKING_APY_CHART.TITLE')}</CardTitle>

      <ChartContainer config={chartConfig} className='h-[220px] w-full'>
        <LineChart accessibilityLayer data={chartData}>
          <CartesianGrid strokeDasharray='0' vertical={false} />
          <YAxis
            dataKey='apy'
            tickFormatter={v => formatShortNumber(v) + '%'}
            interval={0}
            className='text-xs font-normal'
            label={{
              className: 'font-inter fill-gray-700 font-medium',
              value: t('CHART.PERCENTAGE'),
              style: { textAnchor: 'middle', fontWeight: 500 },
              angle: -90,
              position: 'left',
              offset: 0,
            }}
            strokeWidth={0}
          />
          <XAxis dataKey='name' strokeWidth={0}>
            <Label
              value={t('CHART.MONTH')}
              offset={-3}
              position='insideBottom'
              className='font-inter fill-gray-700 font-medium'
            />
          </XAxis>
          <Line
            type='monotone'
            dataKey='apy'
            stroke='var(--color-success-700)'
            strokeWidth={2}
            dot={false}
          />
          <Tooltip content={<CustomTooltip />} />
        </LineChart>
      </ChartContainer>
    </Card>
  );
};

export default StakingApyChart;
