import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import { ManageProductService } from 'src/routes/product/manage-product.service'
import {
  CreateProductBodyDTO,
  CreateProductResDTO,
  GetManageProductsQueryDTO,
  GetProductResDTO,
  GetProductsResDTO,
  ProductIdParamDTO,
  UpdateProductBodyDTO,
  UpdateProductResDTO,
} from 'src/routes/product/product.dto'
import type { RoleNameType } from 'src/shared/constants/role.constant'
import ActiveRole from 'src/shared/decorators/active-role.decorator'
import ActiveUser from 'src/shared/decorators/active-user.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('manage-products')
export class ManageProductController {
  constructor(private readonly manageProductService: ManageProductService) {}

  @Get()
  @ZodResponse({ type: GetProductsResDTO })
  getProducts(
    @Query() query: GetManageProductsQueryDTO,
    @ActiveRole('name') roleName: RoleNameType,
    @ActiveUser('userId') userId: number,
  ) {
    return this.manageProductService.getProducts({
      query,
      roleNameAgent: roleName,
      userIdAgent: userId,
    })
  }

  @Get(':productId')
  @ZodResponse({ type: GetProductResDTO })
  getProduct(
    @Param() param: ProductIdParamDTO,
    @ActiveRole('name') roleName: RoleNameType,
    @ActiveUser('userId') userId: number,
  ) {
    return this.manageProductService.getProduct({
      productId: param.productId,
      roleNameAgent: roleName,
      userIdAgent: userId,
    })
  }

  @Delete(':productId')
  @ZodResponse({ type: MessageResDTO })
  deleteProduct(
    @Param() param: ProductIdParamDTO,
    @ActiveRole('name') roleName: RoleNameType,
    @ActiveUser('userId') userId: number,
  ) {
    return this.manageProductService.deleteProduct({
      productId: param.productId,
      roleNameAgent: roleName,
      userIdAgent: userId,
    })
  }

  @Post()
  @ZodResponse({ type: CreateProductResDTO })
  createProduct(@Body() body: CreateProductBodyDTO, @ActiveUser('userId') createdById: number) {
    return this.manageProductService.createProduct({
      body,
      createdById,
    })
  }

  @Put(':productId')
  @ZodResponse({ type: UpdateProductResDTO })
  updateProduct(
    @Param() param: ProductIdParamDTO,
    @Body() body: UpdateProductBodyDTO,
    @ActiveUser('userId') updatedById: number,
    @ActiveRole('name') roleName: RoleNameType,
  ) {
    return this.manageProductService.updateProduct({
      productId: param.productId,
      body,
      updatedById,
      roleNameAgent: roleName,
    })
  }
}
