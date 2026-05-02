import { Injectable } from '@nestjs/common'

import { ProductWhereUniqueInput } from 'generated/prisma/models'
import {
  CreateProductBodyType,
  GetProductsQueryType,
  ProductDetailType,
  ProductIncludeTranslationsType,
  ProductType,
  UpdateProductBodyType,
} from 'src/routes/product/product.schema'
import { ALL_LANGUAGES_CODE } from 'src/shared/constants/utils.constant'
import { SerializeAll } from 'src/shared/decorators/serialize.decorator'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
@SerializeAll()
export class ProductRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    query: GetProductsQueryType,
    languageId: string,
  ): Promise<{
    totalProducts: number
    products: ProductIncludeTranslationsType[]
  }> {
    const skip = (query.page - 1) * query.limit
    const take = query.limit
    const [totalProducts, products] = await Promise.all([
      this.prisma.product.count({
        where: {
          deletedAt: null,
        },
      }),
      this.prisma.product.findMany({
        where: {
          deletedAt: null,
        },
        include: {
          productTranslations: {
            where: languageId === ALL_LANGUAGES_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
          },
        },
        skip,
        take,
      }) as any,
    ])
    return {
      totalProducts,
      products,
    }
  }

  findUniqueDetail(where: ProductWhereUniqueInput, languageId: string): Promise<ProductDetailType | null> {
    return this.prisma.product.findUnique({
      where,
      include: {
        productTranslations: {
          where: languageId === ALL_LANGUAGES_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
        },
        categories: {
          where: { deletedAt: null },
          include: {
            categoryTranslations: {
              where: languageId === ALL_LANGUAGES_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
            },
          },
        },
        brand: {
          where: { deletedAt: null },
          include: {
            brandTranslations: {
              where: languageId === ALL_LANGUAGES_CODE ? { deletedAt: null } : { languageId, deletedAt: null },
            },
          },
        },
        skus: {
          where: { deletedAt: null },
        },
      },
    }) as any
  }

  delete(where: ProductWhereUniqueInput, isHard?: boolean) {
    if (isHard) {
      return this.prisma.product.delete({
        where,
      })
    } else {
      const now = new Date()
      return Promise.all([
        this.prisma.product.update({
          where: {
            ...where,
            deletedAt: null,
          },
          data: {
            deletedAt: now,
          },
        }),
        this.prisma.sKU.updateMany({
          where: {
            productId: where.id,
          },
          data: {
            deletedAt: now,
          },
        }),
      ])
    }
  }

  async create({
    data,
    createdById,
  }: {
    data: CreateProductBodyType
    createdById: number
  }): Promise<ProductDetailType | null> {
    const { skus, categories, ...productData } = data
    const { id } = await this.prisma.product.create({
      data: {
        ...productData,
        createdById,

        categories: {
          connect: categories.map((categoryId) => ({ id: categoryId })),
        },
        skus: {
          createMany: {
            data: skus,
          },
        },
      },
    })
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        productTranslations: {
          where: { deletedAt: null },
        },
        categories: {
          where: { deletedAt: null },
          include: {
            categoryTranslations: {
              where: { deletedAt: null },
            },
          },
        },
        brand: {
          where: { deletedAt: null },
          include: {
            brandTranslations: {
              where: { deletedAt: null },
            },
          },
        },
        skus: {
          where: { deletedAt: null },
        },
      },
    })
    return product as any
  }

  async update({
    data,
    productId,
    updatedById,
  }: {
    data: UpdateProductBodyType
    productId: number
    updatedById: number
  }): Promise<ProductType> {
    /**
     * Có 3 truờng hợp liên quan đến SKU khi update product:
     * 1. SKU không có trong data gửi lên mà có trong database => Xóa SKU đó (update deletedAt)
     * 2. SKU có trong data gửi lên và có trong database => Cập nhật SKU đó
     * 3. SKU có trong data gửi lên mà không có trong database => Tạo mới SKU đó
     */
    const { categories, skus: skusData, ...productData } = data
    // Lấy danh sách SKU hiện tại của product trong database
    const currentSKUs = await this.prisma.sKU.findMany({
      where: {
        productId,
        deletedAt: null,
      },
    })
    // Danh sách id SKU cần xóa (trường hợp 1)
    const skuIdsToDelete = currentSKUs
      .filter((currentSKU) => skusData.every((skuData) => skuData.value !== currentSKU.value))
      .map((sku) => sku.id)
    // Mapping id vào data gửi lên để dễ xử lý trường hợp 2 và 3
    const skusWithId = skusData.map((skuData) => {
      const existingSKU = currentSKUs.find((currentSKU) => currentSKU.value === skuData.value)
      return { ...skuData, id: existingSKU ? existingSKU.id : null }
    })
    // Danh sách SKU cần cập nhật (trường hợp 2)
    const skusToUpdate = skusWithId.filter((sku) => sku.id !== null)
    // Danh sách SKU cần tạo mới (trường hợp 3)
    const skusToCreate = skusWithId
      .filter((sku) => sku.id === null)
      .map((sku) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...skuData } = sku
        return skuData
      })
    const [product] = await this.prisma.$transaction([
      // Cập nhật product
      this.prisma.product.update({
        where: { id: productId, deletedAt: null },
        data: {
          ...productData,
          updatedById,
          categories: {
            set: categories.map((categoryId) => ({ id: categoryId })),
          },
        },
      }) as any,
      // Xóa mềm SKU (trường hợp 1)
      this.prisma.sKU.updateMany({
        where: {
          id: { in: skuIdsToDelete },
        },
        data: {
          deletedAt: new Date(),
        },
      }),
      // Cập nhật SKU (trường hợp 2)
      ...skusToUpdate.map((sku) =>
        this.prisma.sKU.update({
          where: { id: sku.id as number },
          data: {
            value: sku.value,
            price: sku.price,
            images: sku.images,
            stock: sku.stock,
            updatedById,
          },
        }),
      ),
      // Tạo mới SKU (trường hợp 3)
      this.prisma.sKU.createMany({
        data: skusToCreate.map((sku) => ({
          ...sku,
          productId,
          createdById: updatedById,
        })),
      }),
    ])
    return product
  }
}
