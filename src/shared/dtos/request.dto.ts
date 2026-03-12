import { createZodDto } from 'nestjs-zod'

import { EmptyBodySchema } from 'src/shared/schemas/request.shema'

export class EmptyBodyDTO extends createZodDto(EmptyBodySchema) {}
