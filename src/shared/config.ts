import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import z from 'zod'

config({
  path: '.env',
})

if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Không tìm thấy biến môi trường')
  process.exit(1)
}

const envSchema = z.object({
  DATABASE_URL: z.string(),
})

const envSafeParse = envSchema.safeParse(process.env)

if (!envSafeParse.success) {
  console.log('Cung cấp biến môi trường không hợp lệ')
  console.error(envSafeParse.error)
  process.exit(1)
}

const envConfig = envSafeParse.data
export default envConfig
