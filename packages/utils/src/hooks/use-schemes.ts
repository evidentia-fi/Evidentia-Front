'use client';

import BigNumber from 'bignumber.js';
import { TFunction } from 'i18next';
import { z } from 'zod';

import { ISIN_REGEX } from '../constants';

export const useSchemes = (t: TFunction<'translation', undefined>) => {
  const nativeBridgeScheme = z.object({
    from: z.string().min(1, {
      message: t('ERRORS.REQUIRED'),
    }),
    to: z.string().min(1, {
      message: t('ERRORS.REQUIRED'),
    }),
    address: z.string().min(1, {
      message: t('ERRORS.REQUIRED'),
    }),
    amount: z.string({ invalid_type_error: t('ERRORS.INVALID_TYPE_ERROR') }).refine(
      val => {
        const num = new BigNumber(val);
        return num.isFinite() && num.gt(0);
      },
      {
        message: t('ERRORS.REQUIRED'),
      },
    ),
  });

  const allowanceManagementScheme = z.object({
    address: z.string().min(1, {
      message: t('ERRORS.REQUIRED'),
    }),
    hash: z.string().min(1, {
      message: t('ERRORS.REQUIRED'),
    }),
    quantity: z.number().min(0, {
      message: t('ERRORS.REQUIRED'),
    }),
  });

  const createBondScheme = z.object({
    principal: z.number().min(1, {
      message: t('ERRORS.REQUIRED'),
    }),
    coupon: z.number().min(1, {
      message: t('ERRORS.REQUIRED'),
    }),
    issue_date: z.date({
      required_error: t('ERRORS.REQUIRED'),
      invalid_type_error: t('ERRORS.REQUIRED'),
    }),
    exp_date: z.date({
      required_error: t('ERRORS.REQUIRED'),
      invalid_type_error: t('ERRORS.REQUIRED'),
    }),
    isin: z
      .string()
      .min(1, {
        message: t('ERRORS.REQUIRED'),
      })
      .regex(ISIN_REGEX, {
        message: t('ERRORS.INVALID_ISIN'),
      }),
  });

  return { nativeBridgeScheme, allowanceManagementScheme, createBondScheme };
};

type SchemesReturnType = ReturnType<typeof useSchemes>;
type NativeBridgeSchema = SchemesReturnType['nativeBridgeScheme'];
type AllowanceManagementScheme = SchemesReturnType['allowanceManagementScheme'];
type CreateBondScheme = SchemesReturnType['createBondScheme'];
export type TNativeBridgeSchema = z.infer<NativeBridgeSchema>;
export type TAllowanceManagementScheme = z.infer<AllowanceManagementScheme>;
export type TCreateBondScheme = z.infer<CreateBondScheme>;
