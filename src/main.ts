import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ApiTokenGuard } from './auth/api-token.guard'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  app.setGlobalPrefix('api')

  const configService = app.get(ConfigService)
  app.useGlobalGuards(new ApiTokenGuard(configService))

  const port = process.env.PORT || 3333
  await app.listen(port)
  console.log(`🚀 Servidor rodando em http://localhost:${port}`)
}
bootstrap()
