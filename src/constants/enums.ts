/* eslint-disable @typescript-eslint/naming-convention */
export enum BW_LIST {
  BLACK_LIST = 'BLACK_LIST',
  WHITE_LIST = 'WHITE_LIST',
}

export enum SERVICE_TYPES {
  MEETING = 'MEETING',
  FREELANCING_WORK = 'FREELANCING_WORK',
  FULL_TIME_JOB = 'FULL_TIME_JOB',
}

export enum PAYMENT_TYPE {
  ESCROW = 'escrow',
  DIRECT = 'direct',
  MANUAL = 'manual',
}

export enum PAYMENT_ACCOUNTS {
  STRIPE = 'stripe',
}

export enum DIRECT_PAYMENT_OPTIONS {
  STRIPE = 'Stripe',
}

export enum ESCROW_PAYMENT_OPTIONS {
  STRIPE = 'Stripe',
}
