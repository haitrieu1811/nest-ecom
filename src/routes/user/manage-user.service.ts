import { Injectable } from '@nestjs/common'

import { CannotUpdateOrDeleteYourselfException, UserNotFoundException } from 'src/routes/user/user.error'
import { UserRepo } from 'src/routes/user/user.repo'
import {
  CreateUserBodyType,
  CreateUserResType,
  GetListUsersQueryType,
  GetListUsersResType,
  GetUserDetailResType,
  UpdateUserBodyType,
} from 'src/routes/user/user.schema'
import { ROLE_NAME, RoleNameType } from 'src/shared/constants/role.constant'
import { UNIQUE_FIELDS_IN_DB } from 'src/shared/constants/utils.constant'
import {
  EmailAlreadyExistException,
  OnlyAdminActionException,
  PhoneNumberAlreadyExistException,
  RoleNotFoundException,
} from 'src/shared/error'
import {
  extractUniqueConstraintPrismaErrorField,
  isForeignKeyConstraintPrismaError,
  isNotFoundPrismaError,
  isUniqueConstraintPrismaError,
} from 'src/shared/helpers'
import { SharedRoleRepo } from 'src/shared/repositories/shared-role.repo'
import { SharedUserRepo } from 'src/shared/repositories/shared-user.repo'
import { MessageResType } from 'src/shared/schemas/response.schema'
import { HashingService } from 'src/shared/services/hashing.service'

@Injectable()
export class ManageUserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly sharedUserRepo: SharedUserRepo,
    private readonly sharedRoleRepo: SharedRoleRepo,
    private readonly hashingService: HashingService,
  ) {}

  /**
   * Function này kiểm tra xem người thực hiện có quyền tác động đến người khác không.
   * Vì chỉ có người thực hiện là admin role mới có quyền sau: Tạo admin user, update roleId thành admin, xóa admin user.
   * Còn nếu không phải admin thì không được phép tác động đến admin
   */
  private async verifyRole({
    roleNameAgent,
    roleIdTarget,
  }: {
    roleNameAgent: RoleNameType
    roleIdTarget: number
  }): Promise<boolean> {
    if (roleNameAgent === ROLE_NAME.ADMIN) {
      return true
    }
    // User thao tác không phải admin thì roleIdTarget phải khác admin
    const adminRoleId = await this.sharedRoleRepo.getAdminRoleId()
    if (roleIdTarget === adminRoleId) {
      throw OnlyAdminActionException
    }
    return true
  }

  /**
   * Function này kiểm tra userTargetId có phải là bạn không.
   * Bạn không thể tự thao tác với tài khoản của mình (update, delete)
   */
  private verifyYourself({ userAgentId, userTargetId }: { userAgentId: number; userTargetId: number }): boolean {
    if (userTargetId === userAgentId) {
      throw CannotUpdateOrDeleteYourselfException
    }
    return true
  }

  private async getRoleIdByUserId(userId: number): Promise<number> {
    const user = await this.sharedUserRepo.findUnique({
      id: userId,
    })
    if (!user) {
      throw UserNotFoundException
    }
    return user.roleId
  }

  async createUser({
    body,
    createdById,
    roleNameAgent,
  }: {
    body: CreateUserBodyType
    createdById: number
    roleNameAgent: RoleNameType
  }): Promise<CreateUserResType> {
    try {
      // Kiểm tra email, số điện thoại đã tồn tại chưa
      const userByEmail = await this.sharedUserRepo.findUnique({
        email: body.email,
      })
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
      await this.verifyRole({ roleNameAgent, roleIdTarget: body.roleId })
      const user = await this.userRepo.create({ data: body, createdById })
      return user
    } catch (error) {
      if (isForeignKeyConstraintPrismaError(error)) {
        throw RoleNotFoundException
      }
      throw error
    }
  }

  async updateUser({
    body,
    updatedById,
    userId,
    roleNameAgent,
  }: {
    body: UpdateUserBodyType
    userId: number
    updatedById: number
    roleNameAgent: RoleNameType
  }) {
    // Bạn không thể update chính mình
    this.verifyYourself({ userAgentId: updatedById, userTargetId: userId })
    // Chỉ có ADMIN mới được cập nhật user với role là ADMIN, hoặc lên cấp role thành ADMIN
    const roleIdTarget = await this.getRoleIdByUserId(userId)
    await Promise.all([
      this.verifyRole({ roleNameAgent, roleIdTarget }),
      this.verifyRole({ roleNameAgent, roleIdTarget: body.roleId }),
    ])
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
        updatedById,
      })
      return result
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw UserNotFoundException
      }
      if (isForeignKeyConstraintPrismaError(error)) {
        throw RoleNotFoundException
      }
      if (isUniqueConstraintPrismaError(error)) {
        const field = extractUniqueConstraintPrismaErrorField(error)
        if (field === UNIQUE_FIELDS_IN_DB.USER.EMAIL) {
          throw EmailAlreadyExistException
        } else if (field === UNIQUE_FIELDS_IN_DB.USER.PHONE_NUMBER) {
          throw PhoneNumberAlreadyExistException
        }
      }
      throw error
    }
  }

  async deleteUser({
    userId,
    deletedById,
    roleNameAgent,
  }: {
    userId: number
    deletedById: number
    roleNameAgent: RoleNameType
  }): Promise<MessageResType> {
    try {
      // Không được tự xóa chính mình
      this.verifyYourself({ userAgentId: deletedById, userTargetId: userId })
      // Chỉ có ADMIN mới có quyền xóa user có role ADMIN
      const roleIdTarget = await this.getRoleIdByUserId(userId)
      await this.verifyRole({ roleNameAgent, roleIdTarget })
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
      if (isNotFoundPrismaError(error)) {
        throw UserNotFoundException
      }
      throw error
    }
  }

  async getUsers(query: GetListUsersQueryType): Promise<GetListUsersResType> {
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

  async getUser(userId: number): Promise<GetUserDetailResType> {
    const user = await this.userRepo.findUniqueIncludeRolePermissions({
      id: userId,
    })
    if (!user) {
      throw UserNotFoundException
    }
    return user
  }
}
