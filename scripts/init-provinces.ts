import { PrismaService } from 'src/shared/services/prisma.service'
import provincesData from './provinces.json'

const prisma = new PrismaService()

interface WardData {
  name: string
  code: number
  codename: string
  division_type: string
  short_codename: string
}

interface ProvinceData {
  name: string
  code: number
  codename: string
  division_type: string
  phone_code: number
  wards: WardData[]
}

const main = async () => {
  console.log('🚀 Bắt đầu insert dữ liệu provinces và wards...')

  // Kiểm tra nếu đã có dữ liệu
  const existingCount = await prisma.province.count()
  if (existingCount > 0) {
    throw new Error('Đã tồn tại dữ liệu provinces trong cơ sở dữ liệu.')
  }

  // 1. Insert dữ liệu provinces
  const provinces = (provincesData as ProvinceData[]).map((province) => ({
    name: province.name,
    code: province.code,
    codeName: province.codename,
    divisionType: province.division_type,
    phoneCode: province.phone_code,
  }))

  const { count: provincesCount } = await prisma.province.createMany({
    data: provinces,
    skipDuplicates: true,
  })
  console.log(`✅ Đã insert ${provincesCount} provinces`)

  // 2. Thu thập và insert dữ liệu wards
  const allWards: {
    name: string
    code: number
    codeName: string
    divisionType: string
    shortCodeName: string
    provinceCode: number
  }[] = []

  for (const province of provincesData as ProvinceData[]) {
    for (const ward of province.wards) {
      allWards.push({
        name: ward.name,
        code: ward.code,
        codeName: ward.codename,
        divisionType: ward.division_type,
        shortCodeName: ward.short_codename,
        provinceCode: province.code,
      })
    }
  }

  // Insert wards theo batch để tránh quá tải
  const WARD_BATCH_SIZE = 500
  let totalWards = 0

  for (let i = 0; i < allWards.length; i += WARD_BATCH_SIZE) {
    const batch = allWards.slice(i, i + WARD_BATCH_SIZE)
    const { count } = await prisma.ward.createMany({
      data: batch,
      skipDuplicates: true,
    })
    totalWards += count
  }
  console.log(`✅ Đã insert ${totalWards} wards`)

  return { provincesCount, wardsCount: totalWards }
}

main()
  .then(({ provincesCount, wardsCount }) => {
    console.log(`\n🎉 Hoàn thành! Đã khởi tạo ${provincesCount} provinces và ${wardsCount} wards.`)
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Lỗi khi khởi tạo:', error)
    process.exit(1)
  })
