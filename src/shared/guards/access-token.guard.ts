import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JsonWebTokenError } from '@nestjs/jwt'
import capitalize from 'lodash/capitalize'

import { RequestDecodedAccessToken, RequestRole } from 'src/shared/constants/auth.constant'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from 'src/shared/services/token.service'
import { AccessTokenPayload } from 'src/shared/types/utils.type'

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const accessToken = this.getAccessTokenFromHeaders(request)
    const decodedAccessToken = await this.validateAccessToken(accessToken, request)
    await this.validatePermission(decodedAccessToken, request)
    return true
  }

  private getAccessTokenFromHeaders(request: any): string {
    const accessToken = request.headers?.authorization?.split(' ')[1] as string
    if (!accessToken) {
      throw new UnauthorizedException('Error.AccessTokenIsRequired')
    }
    return accessToken
  }

  private async validateAccessToken(accessToken: string, request: any): Promise<AccessTokenPayload> {
    try {
      const decodedAccessToken = await this.tokenService.verifyAccessToken(accessToken)
      request[RequestDecodedAccessToken] = decodedAccessToken
      return decodedAccessToken
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(capitalize(error.message))
      }
      throw new UnauthorizedException()
    }
  }

  private async validatePermission({ roleId }: AccessTokenPayload, request: any): Promise<boolean> {
    const path = request?.route?.path
    const method = request?.method
    const role = await this.prisma.role.findUniqueOrThrow({
      where: {
        id: roleId,
        deletedAt: null,
        isActive: true,
      },
      include: {
        permissions: {
          where: {
            deletedAt: null,
            path,
            method,
          },
          select: {
            path: true,
            method: true,
          },
        },
      },
    })
    const canAccess = role.permissions.length > 0
    if (!canAccess) {
      throw new ForbiddenException('Error.YouCannotAccessThisResource')
    }
    request[RequestRole] = role
    return true
  }
}
