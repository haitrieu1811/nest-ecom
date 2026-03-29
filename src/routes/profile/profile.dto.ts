import { createZodDto } from 'nestjs-zod'

import { GetProfileResSchema, UpdateProfileBodySchema, UpdateProfileResSchema } from 'src/routes/profile/profile.schema'

export class GetProfileResDTO extends createZodDto(GetProfileResSchema) {}
export class UpdateProfileBodyDTO extends createZodDto(UpdateProfileBodySchema) {}
export class UpdateProfileResDTO extends createZodDto(UpdateProfileResSchema) {}
