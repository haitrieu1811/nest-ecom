import { createZodDto } from 'nestjs-zod'

import {
  GetProvincesResSchema,
  GetWardsByProvinceResSchema,
  ProvinceCodeParamSchema,
} from 'src/routes/location/location.schema'

export class ProvinceCodeParamDTO extends createZodDto(ProvinceCodeParamSchema) {}
export class GetProvincesResDTO extends createZodDto(GetProvincesResSchema) {}
export class GetWardsByProvinceResDTO extends createZodDto(GetWardsByProvinceResSchema) {}
