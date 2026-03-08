import { createZodDto } from 'nestjs-zod'

import { MessageResSchema } from 'src/shared/schemas/response.schema'

export class MessageResDTO extends createZodDto(MessageResSchema) {}
