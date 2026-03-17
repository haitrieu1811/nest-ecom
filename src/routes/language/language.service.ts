import { Injectable } from '@nestjs/common'

import { LanguageAlreadyExistException, LanguageNotFoundException } from 'src/routes/language/language.error'
import { LanguageRepo } from 'src/routes/language/language.repo'
import {
  CreateLanguageBodyType,
  CreateLanguageResType,
  GetLanguageResType,
  GetLanguagesResType,
  UpdateLanguageBodyType,
} from 'src/routes/language/language.schema'
import { isNotFoundPrismaErrror, isUniqueConstraintPrismaErrror } from 'src/shared/helpers'
import { MessageResType } from 'src/shared/schemas/response.schema'

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepo: LanguageRepo) {}

  async createLanguage({
    body,
    userId,
  }: {
    body: CreateLanguageBodyType
    userId: number
  }): Promise<CreateLanguageResType> {
    try {
      const result = await this.languageRepo.create({ data: body, userId })
      return result
    } catch (error) {
      if (isUniqueConstraintPrismaErrror(error)) {
        throw LanguageAlreadyExistException
      }
      throw error
    }
  }

  async getLanguages(): Promise<GetLanguagesResType> {
    const [data, totalItems] = await Promise.all([this.languageRepo.findMany(), this.languageRepo.count()])
    return {
      data,
      totalItems,
    }
  }

  async getLanguage(languageId: string): Promise<GetLanguageResType> {
    const language = await this.languageRepo.findUnique({
      id: languageId,
    })
    if (!language) {
      throw LanguageNotFoundException
    }
    return language
  }

  async updateLanguage({
    languageId,
    body,
    userId,
  }: {
    languageId: string
    body: UpdateLanguageBodyType
    userId: number
  }): Promise<GetLanguageResType> {
    try {
      const result = await this.languageRepo.update({
        where: {
          id: languageId,
        },
        data: {
          ...body,
          updatedById: userId,
        },
      })
      return result
    } catch (error) {
      if (isNotFoundPrismaErrror(error)) {
        throw LanguageNotFoundException
      } else if (isUniqueConstraintPrismaErrror(error)) {
        throw LanguageAlreadyExistException
      }
      throw error
    }
  }

  async deleteLanguage({ languageId, userId }: { languageId: string; userId: number }): Promise<MessageResType> {
    try {
      await this.languageRepo.delete({
        where: {
          id: languageId,
        },
        userId,
        isHard: true,
      })
      return {
        message: 'Success.DeleteLanguage',
      }
    } catch (error) {
      if (isNotFoundPrismaErrror(error)) {
        throw LanguageNotFoundException
      }
      throw error
    }
  }
}
