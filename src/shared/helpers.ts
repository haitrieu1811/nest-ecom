import { randomInt } from 'crypto'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

import { Prisma } from 'generated/prisma/client'

export const generateOTP = () => {
  return randomInt(100000, 1000000).toString()
}

export const isUniqueConstraintPrismaError = (err: unknown): err is Prisma.PrismaClientKnownRequestError => {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002'
}

export const isNotFoundPrismaError = (err: unknown): err is Prisma.PrismaClientKnownRequestError => {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025'
}

export const isForeignKeyConstraintPrismaError = (err: unknown): err is Prisma.PrismaClientKnownRequestError => {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003'
}

export const extractUniqueConstraintPrismaErrorField = (error: Prisma.PrismaClientKnownRequestError): string | null => {
  // Ưu tiên Prisma chuẩn trước
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  let fields: string[] | undefined | unknown = error?.meta?.target
  // Fallback cho adapter (PostgreSQL, etc.)
  if (!fields) {
    fields = (error?.meta?.driverAdapterError as any)?.cause?.constraint?.fields
  }
  // Không có dữ liệu
  if (!fields || !Array.isArray(fields)) {
    return null
  }
  // Normalize: bỏ dấu " nếu có
  return fields.map((field) => (typeof field === 'string' ? field.replace(/"/g, '').trim() : field))[0]
}

export const generateFilename = (filename: string) => {
  const ext = path.extname(filename)
  return `${uuidv4()}${ext}`
}
