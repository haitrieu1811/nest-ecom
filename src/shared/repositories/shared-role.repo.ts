import { Injectable } from '@nestjs/common'

import { ROLE_NAME } from 'src/shared/constants/role.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class SharedRoleRepo {
  clientRoleId: number | null = null
  adminRoleId: number | null = null

  constructor(private readonly prisma: PrismaService) {}

  // Get và cache client role id
  async getClientRoleId() {
    if (this.clientRoleId) {
      return this.clientRoleId
    }
    const clientRole = await this.prisma.role.findUnique({
      where: {
        name: ROLE_NAME.CLIENT,
        deletedAt: null,
      },
    })
    if (!clientRole) {
      throw new Error('Error.CannotFoundClientRole')
    }
    this.clientRoleId = clientRole.id
    return clientRole.id
  }

  // Get và cache admin role id
  async getAdminRoleId() {
    if (this.adminRoleId) {
      return this.adminRoleId
    }
    const adminRole = await this.prisma.role.findUnique({
      where: {
        name: ROLE_NAME.ADMIN,
        deletedAt: null,
      },
    })
    if (!adminRole) {
      throw new Error('Error.CannotFoundAdminRole')
    }
    this.adminRoleId = adminRole.id
    return adminRole.id
  }
}
