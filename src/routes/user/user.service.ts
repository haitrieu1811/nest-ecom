import { Injectable } from '@nestjs/common'

import {
  CannotDeleteYourSelfException,
  CannotUpdateYourSelfException,
  UserNotFoundException,
} from 'src/routes/user/user.error'
import { UserRepo } from 'src/routes/user/user.repo'
import {
  CreateUserBodyType,
  CreateUserResType,
  GetUserResType,
  GetUsersResType,
  UpdateUserBodyType,
} from 'src/routes/user/user.schema'
import {
  EmailAlreadyExistException,
  OnlyAdminActionException,
  PhoneNumberAlreadyExistException,
  RoleNotFoundException,
} from 'src/shared/error'
import { isForeignKeyConstraintPrismaErrror, isNotFoundPrismaErrror } from 'src/shared/helpers'
import { SharedRoleRepo } from 'src/shared/repositories/shared-role.repo'
import { SharedUserRepo } from 'src/shared/repositories/shared-user.repo'
import { PaginationQueryType } from 'src/shared/schemas/request.shema'
import { MessageResType } from 'src/shared/schemas/response.schema'
import { HashingService } from 'src/shared/services/hashing.service'

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly sharedUserRepo: SharedUserRepo,
    private readonly sharedRoleRepo: SharedRoleRepo,
    private readonly hashingService: HashingService,
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
      const [userByEmail, creator, adminRoleId] = await Promise.all([
        this.sharedUserRepo.findUnique({
          email: body.email,
        }),
        this.sharedUserRepo.findUnique({
          id: createdById,
        }),
        this.sharedRoleRepo.getAdminRoleId(),
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

  async updateUser({ body, updatedById, userId }: { body: UpdateUserBodyType; userId: number; updatedById: number }) {
    // Bạn không thể cập nhật chính mình
    if (userId === updatedById) {
      throw CannotUpdateYourSelfException
    }
    const [adminRoleId, user, updater] = await Promise.all([
      this.sharedRoleRepo.getAdminRoleId(),
      this.sharedUserRepo.findUnique({
        id: userId,
      }),
      this.sharedUserRepo.findUnique({
        id: updatedById,
      }),
    ])
    // Chỉ có ADMIN mới được cập nhật user với role là ADMIN, hoặc lên cấp role thành ADMIN
    if ((user?.roleId === adminRoleId || body.roleId === adminRoleId) && updater?.roleId !== adminRoleId) {
      throw OnlyAdminActionException
    }
    try {
      const hashedPassword = await this.hashingService.hash(body.password)
      const result = await this.sharedUserRepo.update({
        where: {
          id: userId,
        },
        data: {
          ...body,
          password: hashedPassword,
        },
      })
      return result
    } catch (error) {
      if (isNotFoundPrismaErrror(error)) {
        throw UserNotFoundException
      }
      if (isForeignKeyConstraintPrismaErrror(error)) {
        throw RoleNotFoundException
      }
      throw error
    }
  }

  async deleteUser({
    userId,
    deletedById,
    deletedByRoleId,
  }: {
    userId: number
    deletedById: number
    deletedByRoleId: number
  }): Promise<MessageResType> {
    try {
      // Không được tự xóa chính mình
      if (userId === deletedById) {
        throw CannotDeleteYourSelfException
      }
      const [adminRoleId, user] = await Promise.all([
        this.sharedRoleRepo.getAdminRoleId(),
        this.sharedUserRepo.findUnique({
          id: userId,
        }),
      ])
      // Chỉ có ADMIN mới có quyền xóa user có role ADMIN
      if (user?.roleId === adminRoleId && deletedByRoleId !== adminRoleId) {
        throw OnlyAdminActionException
      }
      await this.userRepo.delete({
        where: {
          id: userId,
        },
        isHard: true,
      })
      return {
        message: 'Success.DeletedUser',
      }
    } catch (error) {
      if (isNotFoundPrismaErrror(error)) {
        throw UserNotFoundException
      }
      throw error
    }
  }

  async getUsers(query: PaginationQueryType): Promise<GetUsersResType> {
    const { users, totalUsers } = await this.userRepo.findMany(query)
    return {
      data: users,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalRows: totalUsers,
        totalPages: Math.ceil(totalUsers / query.limit),
      },
    }
  }

  async getUser(userId: number): Promise<GetUserResType> {
    const user = await this.userRepo.findUnique({
      id: userId,
    })
    if (!user) {
      throw UserNotFoundException
    }
    return user
  }
}
