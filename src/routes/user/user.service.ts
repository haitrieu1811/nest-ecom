import { Injectable } from '@nestjs/common'

import { UserRepo } from 'src/routes/user/user.repo'
import { CreateUserBodyType, CreateUserResType } from 'src/routes/user/user.schema'
import {
  EmailAlreadyExistException,
  OnlyAdminActionException,
  PhoneNumberAlreadyExistException,
  RoleNotFoundException,
} from 'src/shared/error'
import { isForeignKeyConstraintPrismaErrror } from 'src/shared/helpers'
import { SharedRoleRepo } from 'src/shared/repositories/shared-role.repo'
import { SharedUserRepo } from 'src/shared/repositories/shared-user.repo'

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly sharedUserRepo: SharedUserRepo,
    private readonly sharedRoleRepo: SharedRoleRepo,
  ) {}

  async createUser({
    body,
    createdById,
  }: {
    body: CreateUserBodyType
    createdById: number
  }): Promise<CreateUserResType> {
    try {
      // Kiểm tra email, số điện thoại đã tồn tại chưa
      const [userByEmail, creator] = await Promise.all([
        this.sharedUserRepo.findUnique({
          email: body.email,
        }),
        this.sharedUserRepo.findUnique({
          id: createdById,
        }),
      ])
      if (userByEmail) {
        throw EmailAlreadyExistException
      }
      if (body.phoneNumber) {
        const userByPhoneNumber = await this.sharedUserRepo.findUnique({
          phoneNumber: body.phoneNumber,
        })
        if (userByPhoneNumber) {
          throw PhoneNumberAlreadyExistException
        }
      }
      // Chỉ có ADMIN mới tạo user có role ADMIN
      const adminRoleId = await this.sharedRoleRepo.getAdminRoleId()
      if (body.roleId === adminRoleId && creator?.roleId !== adminRoleId) {
        throw OnlyAdminActionException
      }
      const user = await this.userRepo.create({ data: body, createdById })
      return user
    } catch (error) {
      if (isForeignKeyConstraintPrismaErrror(error)) {
        throw RoleNotFoundException
      }
      throw error
    }
  }
}
