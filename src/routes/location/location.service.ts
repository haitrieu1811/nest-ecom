import { Injectable } from '@nestjs/common'

import { LocationRepo } from 'src/routes/location/location.repo'
import { GetProvincesResType, GetWardsByProvinceResType } from 'src/routes/location/location.schema'

@Injectable()
export class LocationService {
  constructor(private readonly locationRepo: LocationRepo) {}

  async getProvinces(): Promise<GetProvincesResType> {
    const provinces = await this.locationRepo.findAllProvinces()
    return { data: provinces }
  }

  async getWardsByProvinceCode(provinceCode: number): Promise<GetWardsByProvinceResType> {
    const wards = await this.locationRepo.findWardsByProvinceCode(provinceCode)
    return { data: wards }
  }
}
