import { NestFactory } from '@nestjs/core'

import { AppModule } from 'src/app.module'
import { HttpMethodType } from 'src/shared/constants/permission.constant'
import { ROLE_NAME } from 'src/shared/constants/role.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

const prisma = new PrismaService()

// Các module seller được quyền truy cập: auth, profile, media, brands, brand-translations
// Các module client được quyền truy cập: auth, profile, media
// Role admin và seller thì được truy cập tất cả các module
const SELLER_ALLOWED_MODULES = ['auth', 'profile', 'media', 'products', 'product-translations'] as const
const CLIENT_ALLOWED_MODULES = ['auth', 'profile', 'media'] as const

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(3030)
  const server = app.getHttpAdapter().getInstance()
  const router = server.router

  // Lấy tất cả permissions hiện có trong DB
  const permissionsInDB = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  })

  // Lấy tất cả route hiện có trong ứng dụng
  const availableRoutes: {
    path: string
    method: HttpMethodType
    name: string
    module: string
  }[] = router.stack
    .map((layer) => {
      if (layer.route) {
        const path = layer.route?.path
        const method = String(layer.route?.stack[0].method).toUpperCase()
        const module = String(layer.route?.path)?.split('/')[1]
        return {
          path,
          method,
          name: `${method} ${path}`,
          module,
        }
      }
    })
    .filter((item) => item !== undefined)

  const permissionsInDBMap: Record<string, (typeof permissionsInDB)[0]> = permissionsInDB.reduce((acc, item) => {
    acc[`${item.method}-${item.path}`] = item
    return acc
  }, {})
  const availableRoutesMap: Record<string, (typeof availableRoutes)[0]> = availableRoutes.reduce((acc, item) => {
    acc[`${item.method}-${item.path}`] = item
    return acc
  }, {})

  // Xác định permissions cần xóa và cần thêm vào DB
  const permissionsToDelete = permissionsInDB.filter((item) => !availableRoutesMap[`${item.method}-${item.path}`])
  const routesToAdd = availableRoutes.filter((item) => !permissionsInDBMap[`${item.method}-${item.path}`])

  // Thực hiện xóa và thêm permissions vào DB
  const [{ count: deletedCount }, { count: createdCount }] = await Promise.all([
    prisma.permission.deleteMany({
      where: {
        id: {
          in: permissionsToDelete.map((item) => item.id),
        },
      },
    }),
    prisma.permission.createMany({
      data: routesToAdd,
      skipDuplicates: true,
    }),
  ])
  console.log(`Đã xóa ${deletedCount} permissions.`)
  console.log(`Đã tạo ${createdCount} permissions.`)

  // Lấy lại danh sách các permission sau khi thêm và xóa thành công
  const $updatedPermissionsInDB = prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  })
  // Tìm role ADMIN, MANAGER, SELLER, CLIENT để thêm permissions mới vào các role này
  const $adminRole = prisma.role.findUniqueOrThrow({
    where: {
      name: ROLE_NAME.ADMIN,
      deletedAt: null,
    },
  })
  const $managerRole = prisma.role.findUniqueOrThrow({
    where: {
      name: ROLE_NAME.MANAGER,
      deletedAt: null,
    },
  })
  const $sellerRole = prisma.role.findUniqueOrThrow({
    where: {
      name: ROLE_NAME.SELLER,
      deletedAt: null,
    },
  })
  const $clientRole = prisma.role.findUniqueOrThrow({
    where: {
      name: ROLE_NAME.CLIENT,
      deletedAt: null,
    },
  })
  const [updatedPermissionsInDB, adminRole, managerRole, sellerRole, clientRole] = await Promise.all([
    $updatedPermissionsInDB,
    $adminRole,
    $managerRole,
    $sellerRole,
    $clientRole,
  ])
  // Thêm permissions cho từng role dựa trên module mà permission đó thuộc về
  const permissionsToUpdateForSeller = updatedPermissionsInDB.filter((item) =>
    SELLER_ALLOWED_MODULES.includes(item.module as any),
  )
  const permissionsToUpdateForClient = updatedPermissionsInDB.filter((item) =>
    CLIENT_ALLOWED_MODULES.includes(item.module as any),
  )
  await Promise.all([
    // Admin
    prisma.role.update({
      where: {
        id: adminRole.id,
        deletedAt: null,
      },
      data: {
        permissions: {
          set: updatedPermissionsInDB.map((item) => ({ id: item.id })),
        },
      },
    }),
    // Manager
    prisma.role.update({
      where: {
        id: managerRole.id,
        deletedAt: null,
      },
      data: {
        permissions: {
          set: updatedPermissionsInDB.map((item) => ({ id: item.id })),
        },
      },
    }),
    // Seller
    prisma.role.update({
      where: {
        id: sellerRole.id,
        deletedAt: null,
      },
      data: {
        permissions: {
          set: permissionsToUpdateForSeller.map((item) => ({ id: item.id })),
        },
      },
    }),
    // Client
    prisma.role.update({
      where: {
        id: clientRole.id,
        deletedAt: null,
      },
      data: {
        permissions: {
          set: permissionsToUpdateForClient.map((item) => ({ id: item.id })),
        },
      },
    }),
  ])
  console.log(`Đã thêm ${updatedPermissionsInDB.length} permissions cho role ${adminRole.name}`)
  console.log(`Đã thêm ${updatedPermissionsInDB.length} permissions cho role ${managerRole.name}`)
  console.log(`Đã thêm ${permissionsToUpdateForSeller.length} permissions cho role ${sellerRole.name}`)
  console.log(`Đã thêm ${permissionsToUpdateForClient.length} permissions cho role ${clientRole.name}`)

  process.exit(1)
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
