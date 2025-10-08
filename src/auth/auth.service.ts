import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(private config: ConfigService) {}

  async validarSenha(senha: string): Promise<boolean> {
    const senhaEnv = this.config.get<string>('APP_PASSCODE')
    const match = senha === senhaEnv
    if (!match) throw new UnauthorizedException('Senha incorreta')
    return true
  }
}
