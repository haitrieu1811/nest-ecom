import { Injectable } from '@nestjs/common'

import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  test() {
    return this.prisma.user.findMany()
  }
}
