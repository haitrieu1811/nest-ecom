// Source - https://stackoverflow.com/a/63333671
// Posted by oviniciusfeitosa, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-17, License - CC BY-SA 4.0

import { NestFactory } from '@nestjs/core'

import { AppModule } from 'src/app.module'
import { HttpMethodType } from 'src/shared/constants/permission.constant'
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
  }[] = router.stack
    .map((layer) => {
      if (layer.route) {
        const path = layer.route?.path
        const method = String(layer.route?.stack[0].method).toUpperCase()
        return {
          path,
          method,
          name: `${method} ${path}`,
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
    }),
  ])
  console.log(`Đã xóa ${deletedCount} permissions.`)
  console.log(`Đã tạo ${createdCount} permissions.`)
  process.exit(1)
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
