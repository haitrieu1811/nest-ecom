import { Module } from '@nestjs/common'

import { AddressController } from 'src/routes/location/address/address.controller'
import { AddressRepo } from 'src/routes/location/address/address.repo'
import { AddressService } from 'src/routes/location/address/address.service'
import { LocationController } from 'src/routes/location/location.controller'
import { LocationRepo } from 'src/routes/location/location.repo'
import { LocationService } from 'src/routes/location/location.service'

@Module({
  controllers: [LocationController, AddressController],
  providers: [LocationService, LocationRepo, AddressService, AddressRepo],
})
export class LocationModule {}
