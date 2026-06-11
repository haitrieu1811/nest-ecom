import { Injectable } from '@nestjs/common'

import { UserNotFoundException } from 'src/routes/user/user.error'
import { UserRepo } from 'src/routes/user/user.repo'
import { GetListSellersResType, GetListUsersQueryType, GetSellerDetailResType } from 'src/routes/user/user.schema'

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepo) {}

  async getListSellers(query: GetListUsersQueryType): Promise<GetListSellersResType> {
    const { sellers, totalSellers } = await this.userRepo.getListSellers(query)
    return {
      data: sellers,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalRows: totalSellers,
        totalPages: Math.ceil(totalSellers / query.limit),
      },
    }
  }

  async getSellerDetail(userId: number): Promise<GetSellerDetailResType> {
    const seller = await this.userRepo.getSellerDetail(userId)
    if (!seller) {
      throw UserNotFoundException
    }
    return seller
  }
}
