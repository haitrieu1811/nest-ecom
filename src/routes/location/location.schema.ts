import z from 'zod'

export const ProvinceSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().max(100),
  code: z.number().int(),
  codeName: z.string().max(100),
  divisionType: z.string().max(50),
  phoneCode: z.number().int(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const WardSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().max(100),
  code: z.number().int(),
  codeName: z.string().max(100),
  divisionType: z.string().max(50),
  shortCodeName: z.string().max(100),
  provinceCode: z.number().int(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const ProvinceCodeParamSchema = z
  .object({
    provinceCode: z.coerce
      .number()
      .int('Error.ProvinceCodeMustBeAnInteger')
      .positive('Error.ProvinceCodeMustBePositive'),
  })
  .strict()

export const GetProvincesResSchema = z.object({
  data: z.array(ProvinceSchema),
})

export const GetWardsByProvinceResSchema = z.object({
  data: z.array(WardSchema),
})

export type ProvinceType = z.infer<typeof ProvinceSchema>
export type WardType = z.infer<typeof WardSchema>
export type ProvinceCodeParamType = z.infer<typeof ProvinceCodeParamSchema>
export type GetProvincesResType = z.infer<typeof GetProvincesResSchema>
export type GetWardsByProvinceResType = z.infer<typeof GetWardsByProvinceResSchema>
