import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { cleanupOpenApiDoc } from 'nestjs-zod'

import { AppModule } from 'src/app.module'
import envConfig from 'src/shared/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()

  // Swagger
  const openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Nest Ecom API')
      .setDescription('Toàn bộ API của hệ thống Nest Ecom')
      .setVersion('1.0')
      .build(),
  )
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(openApiDoc))

  await app.listen(envConfig.PORT ?? 3000)
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
