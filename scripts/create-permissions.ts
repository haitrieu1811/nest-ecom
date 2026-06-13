import { NestFactory } from '@nestjs/core'

import { AppModule } from 'src/app.module'
import { HttpMethodType } from 'src/shared/constants/permission.constant'
import { ROLE_NAME, RoleNameType } from 'src/shared/constants/role.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

const prisma = new PrismaService()

// Các module seller được quyền truy cập: auth, profile, media, brands, brand-translations
// Các module client được quyền truy cập: auth, profile, media
// Role admin và seller thì được truy cập tất cả các module
const SELLER_ALLOWED_MODULES = [
  'auth',
  'profile',
  'media',
  'manage-products',
  'product-translations',
  'locations',
] as const
const CLIENT_ALLOWED_MODULES = ['auth', 'profile', 'media', 'products', 'locations'] as const

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
  const updatedPermissionsInDB = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  })
  // Thêm permissions cho từng role dựa trên module mà permission đó thuộc về
  const permissionIdsForAdminAndManager = updatedPermissionsInDB.map((item) => ({ id: item.id }))
  const permissionIdsForSeller = updatedPermissionsInDB
    .filter((item) => SELLER_ALLOWED_MODULES.includes(item.module as any))
    .map((item) => ({ id: item.id }))
  const permissionIdsForClient = updatedPermissionsInDB
    .filter((item) => CLIENT_ALLOWED_MODULES.includes(item.module as any))
    .map((item) => ({ id: item.id }))
  // Cập nhật lại permissions cho các role Admin, Manager, Seller và Client
  await Promise.all([
    updateRole(ROLE_NAME.ADMIN, permissionIdsForAdminAndManager),
    updateRole(ROLE_NAME.MANAGER, permissionIdsForAdminAndManager),
    updateRole(ROLE_NAME.SELLER, permissionIdsForSeller),
    updateRole(ROLE_NAME.CLIENT, permissionIdsForClient),
  ])
  console.log(`Đã thêm ${updatedPermissionsInDB.length} permissions cho role Admin và Manager`)
  console.log(`Đã thêm ${permissionIdsForSeller.length} permissions cho role Seller`)
  console.log(`Đã thêm ${permissionIdsForClient.length} permissions cho role Client`)

  process.exit(1)
}

const updateRole = async (roleName: RoleNameType, permissionIds: { id: number }[]) => {
  const role = await prisma.role.findUniqueOrThrow({
    where: {
      name: roleName,
      deletedAt: null,
    },
  })
  return prisma.role.update({
    where: {
      id: role.id,
      deletedAt: null,
    },
    data: {
      permissions: {
        set: permissionIds,
      },
    },
  })
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
