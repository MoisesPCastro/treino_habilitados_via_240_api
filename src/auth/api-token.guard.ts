import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ApiTokenGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers['authorization']

    if (!authHeader) throw new UnauthorizedException('Token não fornecido')

    const token = authHeader.replace('Bearer ', '').trim()
    const validToken = this.configService.get<string>('API_TOKEN')

    if (token !== validToken) {
      throw new UnauthorizedException('Token inválido')
    }

    return true
  }
}
