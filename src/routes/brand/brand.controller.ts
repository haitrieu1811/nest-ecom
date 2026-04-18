import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import {
  BrandIdParamDTO,
  CreateBrandBodyDTO,
  CreateBrandResDTO,
  GetBrandResDTO,
  GetBrandsResDTO,
  UpdateBrandBodyDTO,
  UpdateBrandResDTO,
} from 'src/routes/brand/brand.dto'
import { BrandService } from 'src/routes/brand/brand.service'
import ActiveRole from 'src/shared/decorators/active-role.decorator'
import ActiveUser from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { PaginationQueryDTO } from 'src/shared/dtos/request.dto'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @ZodResponse({ type: CreateBrandResDTO })
  createBrand(@Body() body: CreateBrandBodyDTO, @ActiveUser('userId') userId: number) {
    return this.brandService.createBrand({ body, userId })
  }

  @Get()
  @IsPublic()
  @ZodResponse({ type: GetBrandsResDTO })
  getBrands(@Query() query: PaginationQueryDTO) {
    return this.brandService.getBrands(query)
  }

  @Get(':brandId')
  @IsPublic()
  @ZodResponse({ type: GetBrandResDTO })
  getBrand(@Param() param: BrandIdParamDTO) {
    return this.brandService.getBrand(param.brandId)
  }

  @Put(':brandId')
  @ZodResponse({ type: UpdateBrandResDTO })
  updateBrand(
    @Body() body: UpdateBrandBodyDTO,
    @ActiveUser('userId') userId: number,
    @Param() param: BrandIdParamDTO,
    @ActiveRole('id') agentRoleId: number,
  ) {
    return this.brandService.updateBrand({ body, userId, brandId: param.brandId, agentRoleId })
  }

  @Delete(':brandId')
  @ZodResponse({ type: MessageResDTO })
  deleteBrand(
    @Param() param: BrandIdParamDTO,
    @ActiveUser('userId') userId: number,
    @ActiveRole('id') agentRoleId: number,
  ) {
    return this.brandService.deleteBrand({ brandId: param.brandId, userId, agentRoleId })
  }
}
