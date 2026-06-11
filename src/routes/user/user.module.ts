import { Module } from '@nestjs/common'

import { ManageUserController } from 'src/routes/user/manage-user.controller'
import { ManageUserService } from 'src/routes/user/manage-user.service'
import { UserController } from 'src/routes/user/user.controller'
import { UserRepo } from 'src/routes/user/user.repo'
import { UserService } from 'src/routes/user/user.service'

@Module({
  controllers: [UserController, ManageUserController],
  providers: [UserRepo, UserService, ManageUserService],
})
export class UserModule {}
