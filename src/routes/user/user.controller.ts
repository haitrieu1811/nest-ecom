import { Body, Controller, Post } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import { CreateUserBodyDTO, CreateUserResDTO } from 'src/routes/user/user.dto'
import { UserService } from 'src/routes/user/user.service'
import ActiveUser from 'src/shared/decorators/active-user.decorator'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ZodResponse({ type: CreateUserResDTO })
  createUser(@Body() body: CreateUserBodyDTO, @ActiveUser('userId') userId: number) {
    return this.userService.createUser({
      body,
      createdById: userId,
    })
  }
}
