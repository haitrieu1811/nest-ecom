import { VariantsType } from 'src/routes/product/product.schema'

/* eslint-disable @typescript-eslint/no-namespace */
export {}

declare global {
  namespace PrismaJson {
    type Variants = VariantsType
  }
}
