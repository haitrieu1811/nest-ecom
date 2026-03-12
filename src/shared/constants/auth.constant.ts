export const UserStatus = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
} as const

export const VerificationCodeType = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  LOGIN: 'LOGIN',
  DISABLE_2FA: 'DISABLE_2FA',
} as const

export type TypeOfVerificationCode = keyof typeof VerificationCodeType

export const RequestDecodedAccessToken = 'accessToken'

export const AuthorizationTypes = {
  BEARER: 'BEARER',
  API_KEY: 'API_KEY',
  NONE: 'NONE',
} as const

export type TypeOfAuthorizationTypes = keyof typeof AuthorizationTypes

export const AuthorizationCondition = {
  AND: 'AND',
  OR: 'OR',
} as const

export type AuthorizationConditionType = keyof typeof AuthorizationCondition

export type AuthorizationOptionsType = {
  condition?: AuthorizationConditionType
}
