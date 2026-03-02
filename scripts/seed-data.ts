import { RoleCreateManyInput } from 'generated/prisma/models'
import envConfig from 'src/shared/config'
import { ROLE_NAME } from 'src/shared/constants/role.constant'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

const prisma = new PrismaService()
const hashingService = new HashingService()

const main = async () => {
  const roleCount = await prisma.role.count()
  if (roleCount > 0) {
    throw new Error('Đã tồn tại role trong cơ sở dữ liệu.')
  }
  // Khởi tạo các role cơ bản
  const initRoles: RoleCreateManyInput[] = Object.keys(ROLE_NAME).map((key) => ({
    name: ROLE_NAME[key],
    description: `${ROLE_NAME[key]} ROLE`,
  }))
  const { count } = await prisma.role.createMany({
    data: initRoles,
  })
  // Khởi tạo user admin
  const adminRole = await prisma.role.findUnique({
    where: {
      name: ROLE_NAME.ADMIN,
    },
  })
  if (!adminRole) {
    throw new Error('Không tìm thấy role admin.')
  }
  const hashedPassword = await hashingService.hash(envConfig.ADMIN_PASSWORD)
  const user = await prisma.user.create({
    data: {
      email: envConfig.ADMIN_EMAIL,
      name: envConfig.ADMIN_NAME,
      phoneNumber: envConfig.ADMIN_PHONE_NUMBER,
      password: hashedPassword,
      roleId: adminRole.id,
    },
  })
  return {
    user,
    createdRoleCount: count,
  }
}

main()
  .then(({ createdRoleCount, user }) => {
    console.log(`Đã khởi tạo thành công ${createdRoleCount} role.`)
    console.log('Đã khởi tạo thành công user admin: ', user)
  })
  .catch((error) => {
    console.log(error)
  })
