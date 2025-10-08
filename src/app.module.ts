import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { AlunoModule } from './aluno/aluno.module'
import { AulaModule } from './aula/aula.module'
import { PagamentoModule } from './pagamento/pagamento.module'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    AlunoModule,
    AulaModule,
    PagamentoModule,
    HealthModule 
  ],
})
export class AppModule {}
