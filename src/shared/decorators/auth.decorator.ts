import { SetMetadata } from '@nestjs/common'

import { AuthorizationOptionsType, TypeOfAuthorizationTypes } from 'src/shared/constants/auth.constant'

export const AUTHORIZATION_METADATA_KEY = 'authorization'

export type AuthorizationPayloadType = {
  authTypes: TypeOfAuthorizationTypes[]
  options?: AuthorizationOptionsType
}

export const Auth = (payload: AuthorizationPayloadType) => {
  return SetMetadata(AUTHORIZATION_METADATA_KEY, payload)
}

export const IsPublic = () => Auth({ authTypes: ['NONE'] })
