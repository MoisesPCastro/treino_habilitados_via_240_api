import {
  IsString,
  IsUUID,
  IsDateString,
  IsBoolean,
  IsInt,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator'

export class CreateAulaDto {
  @IsUUID()
  alunoId!: string

  @IsDateString()
  data!: Date

  @IsString()
  hora!: string

  @IsInt()
  @Min(1)
  duracao!: number

  @IsString()
  status!: string

  @IsBoolean()
  paga!: boolean

  @IsOptional()
  @IsString()
  @MaxLength(255)
  observacoes?: string
}
