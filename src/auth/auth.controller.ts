import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('login')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post()
  async login(@Body('senha') senha: string) {
    await this.service.validarSenha(senha)
    return { message: 'Acesso permitido' }
  }
}
