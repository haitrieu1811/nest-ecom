import { Injectable, UnprocessableEntityException } from '@nestjs/common'

import { AuthRepo } from 'src/routes/auth/auth.repo'
import { RegisterBodyType } from 'src/routes/auth/auth.schema'
import { SharedRoleRepo } from 'src/shared/repositories/shared-role.repo'

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepo,
    private readonly sharedRoleRepo: SharedRoleRepo,
  ) {}

  async register({ data, roleId }: { data: RegisterBodyType; roleId: number }) {
    // Kiểm tra email đã tồn tại trên hệ thống hay chưa
    const user = await this.authRepo.findUniqueUser({
      email: data.email,
    })
    if (user) {
      throw new UnprocessableEntityException('Email đã tồn tại trên hệ thống.')
    }
    // Tạo người dùng mới
    const newUser = await this.authRepo.createUser({
      data: {
        email: data.email,
        password: data.password,
      },
      roleId,
    })
    return newUser
  }

  async registerClient(data: RegisterBodyType) {
    const clientRoleId = await this.sharedRoleRepo.getClientRoleId()
    return this.register({
      data,
      roleId: clientRoleId,
    })
  }
}
