import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { TypeOfAuthorizationTypes } from 'src/shared/constants/auth.constant'
import { AUTHORIZATION_METADATA_KEY, AuthorizationPayloadType } from 'src/shared/decorators/auth.decorator'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private readonly authMaps: Record<TypeOfAuthorizationTypes, CanActivate>

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: ApiKeyGuard,
  ) {
    this.authMaps = {
      BEARER: this.accessTokenGuard,
      API_KEY: this.apiKeyGuard,
      NONE: { canActivate: () => true },
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authPayload = this.reflector.getAllAndOverride<AuthorizationPayloadType | undefined>(
      AUTHORIZATION_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? {
      authTypes: ['BEARER'],
      options: {
        condition: 'OR',
      },
    }
    const guards = authPayload.authTypes.map((authType) => this.authMaps[authType])
    let error = new UnauthorizedException()
    if (authPayload.options?.condition === 'OR') {
      for (const guard of guards) {
        const canActivate = await Promise.resolve(guard.canActivate(context)).catch((err) => {
          error = err
          return false
        })
        if (canActivate) {
          return true
        }
      }
      throw error
    } else {
      for (const guard of guards) {
        const canActivate = await Promise.resolve(guard.canActivate(context)).catch((err) => {
          error = err
          return false
        })
        if (!canActivate) {
          throw error
        }
      }
      return true
    }
  }
}
