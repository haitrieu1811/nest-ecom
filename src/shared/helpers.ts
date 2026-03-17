import { randomInt } from 'crypto'

import { Prisma } from 'generated/prisma/client'

export const generateOTP = () => {
  return randomInt(100000, 1000000).toString()
}

export const isUniqueConstraintPrismaErrror = (err: unknown): err is Prisma.PrismaClientKnownRequestError => {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002'
}

export const isNotFoundPrismaErrror = (err: unknown): err is Prisma.PrismaClientKnownRequestError => {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025'
}
