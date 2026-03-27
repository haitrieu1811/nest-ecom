import { NotFoundException } from '@nestjs/common'

export const PermissionNotFoundException = new NotFoundException('Error.PermissionNotFound')
