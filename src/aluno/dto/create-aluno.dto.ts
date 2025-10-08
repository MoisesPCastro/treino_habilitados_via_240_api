import { IsString, IsOptional, IsInt, IsBoolean, Min, MaxLength, IsEmail } from 'class-validator'

export class CreateAlunoDto {
  @IsString()
  @MaxLength(100)
  nome!: string

  @IsString()
  categoriaCnh!: string

  @IsString()
  telefone!: string

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
