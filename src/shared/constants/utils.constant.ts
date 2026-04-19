import path from 'path'

export const UNIQUE_FIELDS_IN_DB = {
  USER: {
    EMAIL: 'email',
    PHONE_NUMBER: 'phoneNumber',
  },
} as const

export const UPLOAD_DIR = path.resolve('upload')

export const ALL_LANGUAGES_CODE = 'all'
