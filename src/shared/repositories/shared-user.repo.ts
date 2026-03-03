import { Injectable } from '@nestjs/common'

import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { UserType } from 'src/shared/schemas/shared-user.schema'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
@SerializeAll()
export class SharedUserRepo {
  constructor(private readonly prisma: PrismaService) {}

  findUnique(uniqueObject: { email: string } | { id: number } | { phoneNumber: string }): Promise<UserType | null> {
    return this.prisma.user.findUnique({
      where: uniqueObject,
    }) as any
  }
}
