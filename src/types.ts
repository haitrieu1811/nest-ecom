import { VariantsType } from 'src/shared/schemas/shared-product.schema'

/* eslint-disable @typescript-eslint/no-namespace */
export {}

declare global {
  namespace PrismaJson {
    type Variants = VariantsType
  }
}
