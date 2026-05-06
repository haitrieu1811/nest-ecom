import path from 'path'

export const UNIQUE_FIELDS_IN_DB = {
  USER: {
    EMAIL: 'email',
    PHONE_NUMBER: 'phoneNumber',
  },
} as const

export const UPLOAD_DIR = path.resolve('upload')

export const ALL_LANGUAGES_CODE = 'all'

export const SORT_BY = {
  NAME: 'name',
  BASE_PRICE: 'basePrice',
  CREATED_AT: 'createdAt',
} as const

export const ORDER_BY = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export type SortByType = keyof typeof SORT_BY
export type OrderByType = keyof typeof ORDER_BY
