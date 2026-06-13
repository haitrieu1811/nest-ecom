import { Module } from '@nestjs/common'

import { LocationController } from 'src/routes/location/location.controller'
import { LocationRepo } from 'src/routes/location/location.repo'
import { LocationService } from 'src/routes/location/location.service'

@Module({
  controllers: [LocationController],
  providers: [LocationService, LocationRepo],
})
export class LocationModule {}
