import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

const saltOrRounds = 10

@Injectable()
export class HashingService {
  hash(value: string) {
    return bcrypt.hash(value, saltOrRounds)
  }

  compare(value: string, hashValue: string) {
    return bcrypt.compare(value, hashValue)
  }
}
