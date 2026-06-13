import { Controller, Get, Param } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'

import { GetProvincesResDTO, GetWardsByProvinceResDTO, ProvinceCodeParamDTO } from 'src/routes/location/location.dto'
import { LocationService } from 'src/routes/location/location.service'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('provinces')
  @IsPublic()
  @ZodResponse({ type: GetProvincesResDTO })
  getProvinces() {
    return this.locationService.getProvinces()
  }

  @Get('provinces/:provinceCode/wards')
  @IsPublic()
  @ZodResponse({ type: GetWardsByProvinceResDTO })
  getWardsByProvince(@Param() param: ProvinceCodeParamDTO) {
    return this.locationService.getWardsByProvinceCode(param.provinceCode)
  }
}
