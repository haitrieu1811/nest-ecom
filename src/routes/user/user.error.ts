import { BadRequestException, NotFoundException } from '@nestjs/common'

export const CannotUpdateYourSelfException = new BadRequestException('Error.CannotUpdateYourSelf')

export const CannotDeleteYourSelfException = new BadRequestException('Error.CannotDeleteYourSelf')

export const UserNotFoundException = new NotFoundException('Error.UserNotFound')
