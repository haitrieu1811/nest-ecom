import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import {
  AuthorizationCondition,
  AuthorizationTypes,
  TypeOfAuthorizationTypes,
} from 'src/shared/constants/auth.constant'
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
      [AuthorizationTypes.BEARER]: this.accessTokenGuard,
      [AuthorizationTypes.API_KEY]: this.apiKeyGuard,
      [AuthorizationTypes.NONE]: { canActivate: () => true },
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authPayload = this.getAuthPayload(context)

    const guards = authPayload.authTypes.map((authType) => this.authMaps[authType])
    return authPayload.options?.condition === AuthorizationCondition.OR
      ? this.handleOrCondition(guards, context)
      : this.handleAndCondition(guards, context)
  }

  private getAuthPayload(context: ExecutionContext) {
    return (
      this.reflector.getAllAndOverride<AuthorizationPayloadType | undefined>(AUTHORIZATION_METADATA_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? {
        authTypes: [AuthorizationTypes.BEARER],
        options: {
          condition: AuthorizationCondition.OR,
        },
      }
    )
  }

  private async handleOrCondition(guards: CanActivate[], context: ExecutionContext): Promise<boolean> {
    let lastError = new UnauthorizedException()
    // Duyệt qua tất cả các guard, khi có một guard return về true thì pass ngay lập tức
    for (const guard of guards) {
      try {
        const canActive = await guard.canActivate(context)
        if (canActive) {
          return true
        }
      } catch (error) {
        lastError = error
      }
    }
    throw lastError
  }

  private async handleAndCondition(guards: CanActivate[], context: ExecutionContext): Promise<boolean> {
    // Duyệt qua tất cả các guard, khi có một guard return về false thì fail ngay lập tức
    for (const guard of guards) {
      try {
        const canActive = await guard.canActivate(context)
        if (!canActive) {
          throw new UnauthorizedException()
        }
      } catch (error) {
        if (error instanceof HttpException) {
          throw error
        }
        throw new UnauthorizedException()
      }
    }
    return true
  }
}
