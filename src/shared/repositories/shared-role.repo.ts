import { Injectable } from '@nestjs/common'

import { ROLE_NAME } from 'src/shared/constants/role.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class SharedRoleRepo {
  clientRoleId: number | null = null

  constructor(private readonly prisma: PrismaService) {}

  // Get và cache client role id
  async getClientRoleId() {
    if (this.clientRoleId) {
      return this.clientRoleId
    }
    const clientRole = await this.prisma.role.findUnique({
      where: {
        name: ROLE_NAME.CLIENT,
      },
    })
    if (!clientRole) {
      throw new Error('Không tìm thấy client role.')
    }
    this.clientRoleId = clientRole.id
    return clientRole.id
  }
}
