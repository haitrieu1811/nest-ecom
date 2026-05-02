export type AccessTokenPayloadInput = {
  userId: number
  roleId: number
  deviceId: number
}

export type AccessTokenPayload = AccessTokenPayloadInput & {
  iat: number
  exp: number
}

export type RefreshTokenPayloadInput = {
  userId: number
}

export type RefreshTokenPayload = RefreshTokenPayloadInput & {
  iat: number
  exp: number
}
