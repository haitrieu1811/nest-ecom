import { Injectable } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import { v4 as uuidv4 } from 'uuid'

import { AuthRepo } from 'src/routes/auth/auth.repo'
import { GetGoogleOAuthLinkResType, GoogleOAuthLinkStateType, TokensResType } from 'src/routes/auth/auth.schema'
import { AuthService } from 'src/routes/auth/auth.service'
import envConfig from 'src/shared/config'
import { SharedRoleRepo } from 'src/shared/repositories/shared-role.repo'
import { HashingService } from 'src/shared/services/hashing.service'

@Injectable()
export class GoogleService {
  private oAuth2Client: OAuth2Client

  constructor(
    private readonly authRepo: AuthRepo,
    private readonly sharedRoleRepo: SharedRoleRepo,
    private readonly hashingService: HashingService,
    private readonly authService: AuthService,
  ) {
    this.oAuth2Client = new google.auth.OAuth2(
      envConfig.GOOGLE_CLIENT_ID,
      envConfig.GOOGLE_CLIENT_SECRET,
      envConfig.GOOGLE_REDIRECT_URI,
    )
  }

  getAuthorizationUrl(payload: GoogleOAuthLinkStateType): GetGoogleOAuthLinkResType {
    // Chỉ định phạm vi
    const scope = ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
    // Tạo state string đưa vào URL
    const stateString = Buffer.from(JSON.stringify(payload)).toString('base64')
    // Tạo URL
    const url = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope,
      state: stateString,
      include_granted_scopes: true,
    })
    return {
      url,
    }
  }

  async googleCallback({ code, state }: { code: string; state: string }): Promise<TokensResType> {
    try {
      let ip = 'Unknown'
      let userAgent = 'Unknown'
      // Lấy payload từ state url
      try {
        if (state) {
          const clientInfo = JSON.parse(Buffer.from(state, 'base64').toString()) as GoogleOAuthLinkStateType
          ip = clientInfo.ip
          userAgent = clientInfo.userAgent
        }
      } catch (error) {
        console.error('Lỗi khi parse state.', error)
      }
      // Dùng code để lấy token
      const { tokens } = await this.oAuth2Client.getToken(code)
      this.oAuth2Client.setCredentials(tokens)
      // Lấy thông tin Google user
      const oAuth2 = google.oauth2({
        auth: this.oAuth2Client,
        version: 'v2',
      })
      const { data } = await oAuth2.userinfo.get()
      if (!data.email) {
        throw new Error('Không thể lấy thông tin người dùng từ Google.')
      }
      let user = await this.authRepo.findUniqueUserIncludeRole({
        email: data.email,
      })
      // Nếu không có user tức là người dùng mới, tiến hành tạo tài khoản mới
      if (!user) {
        const clientRoleId = await this.sharedRoleRepo.getClientRoleId()
        const randomPassword = await this.hashingService.hash(uuidv4())
        user = await this.authRepo.createUserIncludeRole({
          email: data.email,
          name: data.name ?? null,
          avatar: data.picture ?? null,
          roleId: clientRoleId,
          password: randomPassword,
        })
      }
      // Tạo thiết bị đăng nhập
      const device = await this.authRepo.createDevice({
        ip,
        userAgent,
        userId: user.id,
      })
      // Tạo tokens
      const authTokens = await this.authService.signTokens({
        userId: user.id,
        roleId: user.roleId,
        deviceId: device.id,
      })
      return authTokens
    } catch (error) {
      console.log('Đăng nhập Google thất bại', error)
      throw error
    }
  }
}
