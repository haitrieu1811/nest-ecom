import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { StringValue } from 'ms'
import { v4 as uuidv4 } from 'uuid'

import envConfig from 'src/shared/config'
import {
  AccessTokenPayload,
  AccessTokenPayloadInput,
  RefreshTokenPayload,
  RefreshTokenPayloadInput,
} from 'src/shared/types/utils.type'

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken({ userId, roleId, deviceId }: AccessTokenPayloadInput) {
    return this.jwtService.signAsync(
      {
        userId,
        roleId,
        deviceId,
        uuid: uuidv4(),
      },
      {
        algorithm: 'HS256',
        secret: envConfig.ACCESS_TOKEN_SECRET,
        expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN as StringValue,
      },
    )
  }

  signRefreshToken(payload: RefreshTokenPayloadInput & { exp?: number }) {
    if (!payload.exp) {
      return this.jwtService.signAsync(
        {
          userId: payload.userId,
          uuid: uuidv4(),
        },
        {
          algorithm: 'HS256',
          secret: envConfig.REFRESH_TOKEN_SECRET,
          expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN as StringValue,
        },
      )
    }
    return this.jwtService.signAsync(
      {
        userId: payload.userId,
        exp: payload.exp,
        uuid: uuidv4(),
      },
      {
        algorithm: 'HS256',
        secret: envConfig.REFRESH_TOKEN_SECRET,
      },
    )
  }

  verifyAccessToken(token: string): Promise<AccessTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
    })
  }

  verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
    })
  }
}
