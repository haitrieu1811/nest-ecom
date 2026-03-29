import { NestFactory } from '@nestjs/core'

import { AppModule } from 'src/app.module'
import { HttpMethodType } from 'src/shared/constants/permission.constant'
import { ROLE_NAME } from 'src/shared/constants/role.constant'
import { PrismaService } from 'src/shared/services/prisma.service'

const prisma = new PrismaService()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(3030)
  const server = app.getHttpAdapter().getInstance()
  const router = server.router

  const permissionsInDB = await prisma.permission.findMany({
    where: {
      deletedAt: null,
    },
  })

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

  const permissionsToDelete = permissionsInDB.filter((item) => !availableRoutesMap[`${item.method}-${item.path}`])
  const routesToAdd = availableRoutes.filter((item) => !permissionsInDBMap[`${item.method}-${item.path}`])

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
  // Tìm role ADMIN, MANAGER
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
  const [updatedPermissionsInDB, adminRole, managerRole] = await Promise.all([
    $updatedPermissionsInDB,
    $adminRole,
    $managerRole,
  ])
  // Thêm tất cả permission cho role ADMIN, MANAGER
  await Promise.all([
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
  ])
  console.log(`Đã thêm ${updatedPermissionsInDB.length} permissions cho role ${adminRole.name}`)
  console.log(`Đã thêm ${updatedPermissionsInDB.length} permissions cho role ${managerRole.name}`)

  process.exit(1)
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
