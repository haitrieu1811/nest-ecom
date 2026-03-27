import { createZodDto } from 'nestjs-zod'

import { GetProfileResSchema, UpdateProfileResSchema } from 'src/routes/profile/profile.schema'

export class GetProfileResDTO extends createZodDto(GetProfileResSchema) {}
export class UpdateProfileResDTO extends createZodDto(UpdateProfileResSchema) {}
