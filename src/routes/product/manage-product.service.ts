import { Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'

import { ProductCategoryNotFoundException } from 'src/routes/product/product.error'
import { ProductRepo } from 'src/routes/product/product.repo'
import {
  CreateProductBodyType,
  CreateProductResType,
  GetManageProductsQueryType,
  GetProductResType,
  GetProductsResType,
  UpdateProductBodyType,
  UpdateProductResType,
} from 'src/routes/product/product.schema'
import { ROLE_NAME, RoleNameType } from 'src/shared/constants/role.constant'
import { BrandNotFoundException, PrivilegeException, ProductNotFoundException } from 'src/shared/error'
import { SharedBrandRepo } from 'src/shared/repositories/shared-brand.repo'
import { SharedCategoryRepo } from 'src/shared/repositories/shared-category.repo'
import { SharedProductRepo } from 'src/shared/repositories/shared-product.repo'
import { MessageResType } from 'src/shared/schemas/response.schema'

@Injectable()
export class ManageProductService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly sharedBrandRepo: SharedBrandRepo,
    private readonly sharedCategoryRepo: SharedCategoryRepo,
    private readonly sharedProductRepo: SharedProductRepo,
  ) {}

  async getProducts({
    query,
    roleNameAgent,
    userIdAgent,
  }: {
    query: GetManageProductsQueryType
    roleNameAgent: RoleNameType
    userIdAgent: number
  }): Promise<GetProductsResType> {
    this.validatePrivilege({
      roleNameAgent,
      userIdAgent,
      createdById: query.createdById,
    })
    const { totalProducts, products } = await this.productRepo.findMany({
      query,
      languageId: I18nContext.current()?.lang as string,
    })
    return {
      data: products,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(totalProducts / query.limit),
        totalRows: totalProducts,
      },
    }
  }

  async getProduct({
    productId,
    roleNameAgent,
    userIdAgent,
  }: {
    productId: number
    roleNameAgent: RoleNameType
    userIdAgent: number
  }): Promise<GetProductResType> {
    const product = await this.productRepo.findDetail({
      productId,
      languageId: I18nContext.current()?.lang as string,
    })
    if (!product) {
      throw ProductNotFoundException
    }
    this.validatePrivilege({
      roleNameAgent,
      userIdAgent,
      createdById: product.createdById,
    })
    return product
  }

  async deleteProduct({
    productId,
    roleNameAgent,
    userIdAgent,
  }: {
    productId: number
    roleNameAgent: RoleNameType
    userIdAgent: number
  }): Promise<MessageResType> {
    const product = await this.sharedProductRepo.findUnique({
      id: productId,
      deletedAt: null,
    })
    if (!product) {
      throw ProductNotFoundException
    }
    this.validatePrivilege({
      roleNameAgent,
      userIdAgent,
      createdById: product.createdById,
    })
    await this.productRepo.delete({ id: productId })
    return {
      message: 'Success.ProductDeleted',
    }
  }

  async createProduct({
    body,
    createdById,
  }: {
    body: CreateProductBodyType
    createdById: number
  }): Promise<CreateProductResType> {
    await this.validateBrandAndCategory(body.brandId, body.categoryId)
    // Tạo product mới
    const product = (await this.productRepo.create({
      data: body,
      createdById,
    })) as any
    return product
  }

  async updateProduct({
    productId,
    body,
    updatedById,
    roleNameAgent,
  }: {
    body: UpdateProductBodyType
    productId: number
    updatedById: number
    roleNameAgent: RoleNameType
  }): Promise<UpdateProductResType> {
    const product = await this.sharedProductRepo.findUnique({
      id: productId,
      deletedAt: null,
    })
    if (!product) {
      throw ProductNotFoundException
    }
    this.validatePrivilege({
      roleNameAgent,
      userIdAgent: updatedById,
      createdById: product.createdById,
    })
    await this.validateBrandAndCategory(body.brandId, body.categoryId)
    const updatedProduct = await this.productRepo.update({
      data: body,
      productId,
      updatedById,
    })
    return updatedProduct
  }

  /**
   * Hàm này kiểm tra sự tồn tại của brandId và categoryId (nếu có) trong database, nếu không tìm thấy sẽ ném lỗi BrandNotFoundException hoặc ProductCategoryNotFoundException tương ứng
   */
  private validateBrandAndCategory = async (brandId: number | null, categoryId: number | null): Promise<boolean> => {
    // Kiểm tra brand có tồn tại không
    if (brandId) {
      const brand = await this.sharedBrandRepo.findUnique({
        id: brandId,
        deletedAt: null,
      })
      if (!brand) {
        throw BrandNotFoundException
      }
    }
    // Kiểm tra category có tồn tại không
    if (categoryId) {
      const category = await this.sharedCategoryRepo.findUnique({
        id: categoryId,
        deletedAt: null,
      })
      if (!category) {
        throw ProductCategoryNotFoundException
      }
    }
    return true
  }

  /**
   * Hàm này kiểm tra ĐẶC QUYỀN của người dùng, chỉ chủ nhân của sản phẩm hoặc là ADMIN, MANAGER mới được quyền thao tác trên sản phẩm đó
   */
  private validatePrivilege({
    roleNameAgent,
    userIdAgent,
    createdById,
  }: {
    roleNameAgent: RoleNameType
    userIdAgent: number
    createdById: number | null
  }): boolean {
    const allowedRoles: string[] = [ROLE_NAME.ADMIN, ROLE_NAME.MANAGER]
    // Nếu role của người dùng không nằm trong allowedRoles và người dùng không phải là chủ nhân của sản phẩm thì ném lỗi PrivilegeException
    if (!allowedRoles.includes(roleNameAgent) && userIdAgent !== createdById) {
      throw PrivilegeException
    }
    return true
  }
}
