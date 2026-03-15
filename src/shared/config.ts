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

  APP_NAME: z.string(),
  PORT: z.string(),
  API_KEY: z.string(),

  ADMIN_EMAIL: z.string(),
  ADMIN_NAME: z.string(),
  ADMIN_PHONE_NUMBER: z.string(),
  ADMIN_PASSWORD: z.string(),

  OTP_EXPIRES_IN: z.string(),

  RESEND_API_KEY: z.string(),

  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
  GOOGLE_CLIENT_REDIRECT_URI: z.string(),
})

const envSafeParse = envSchema.safeParse(process.env)

if (!envSafeParse.success) {
  console.log('Cung cấp biến môi trường không hợp lệ')
  console.error(envSafeParse.error)
  process.exit(1)
}

const envConfig = envSafeParse.data
export default envConfig
