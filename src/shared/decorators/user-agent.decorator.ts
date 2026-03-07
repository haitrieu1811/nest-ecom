import { createParamDecorator, ExecutionContext } from '@nestjs/common'

const UserAgent = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest()
  return request.headers['user-agent']
})

export default UserAgent
