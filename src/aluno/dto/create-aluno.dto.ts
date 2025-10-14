import { IsString, IsOptional, IsInt, IsBoolean, Min, MaxLength, IsEmail, Matches } from 'class-validator'

export class CreateAlunoDto {
  @IsString()
  @MaxLength(100)
  nome!: string

  @IsString()
  categoriaCnh!: string

  @IsString()
  telefone!: string

  @IsString()
  cpf!: string

  @IsString()
  endereco!: string

  @IsOptional()
  @IsString()
  numeroCarteiraHabilitacao?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsInt()
  @Min(1)
  totalAulas!: number

  @IsInt()
  aulasConcluidas!: number

  @IsBoolean()
  possuiPendencia!: boolean

  @IsString()
  status!: string
}
