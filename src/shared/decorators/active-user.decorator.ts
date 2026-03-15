import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { RequestDecodedAccessToken } from 'src/shared/constants/auth.constant'
import { AccessTokenPayload } from 'src/shared/types/utils.type'

const ActiveUser = createParamDecorator((field: keyof AccessTokenPayload | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const decodedAccessToken = request[RequestDecodedAccessToken] as AccessTokenPayload | undefined
  return field ? decodedAccessToken?.[field] : decodedAccessToken
})

export default ActiveUser
