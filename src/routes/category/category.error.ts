import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common'

export const CategoryNotFoundException = new NotFoundException('Error.CategoryNotFound')

export const CategoryNotAuthorOrAdminException = new ForbiddenException('Error.CategoryNotAuthorOrAdmin')

export const CannotUpdateSubCategoryException = new BadRequestException('Error.CannotUpdateSubCategory')
