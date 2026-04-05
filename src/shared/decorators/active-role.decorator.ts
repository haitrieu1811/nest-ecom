import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { RequestRole } from 'src/shared/constants/auth.constant'
import { RoleIncludePermissionsType } from 'src/shared/schemas/shared-role.schema'

const ActiveRole = createParamDecorator(
  (field: keyof RoleIncludePermissionsType | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const role = request[RequestRole] as RoleIncludePermissionsType | undefined
    return field ? role?.[field] : role
  },
)

export default ActiveRole
