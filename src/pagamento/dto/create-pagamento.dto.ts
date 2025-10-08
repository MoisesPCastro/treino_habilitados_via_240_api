import { IsUUID, IsNumber, IsDateString, IsString, Min, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { typeStatus } from '../types'

export class CreatePagamentoDto {
  @IsUUID()
  alunoId!: string

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorTotal!: number

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valorPago!: number

  @IsDateString()
  dataVencimento!: Date

  @IsEnum(['pendente', 'parcial', 'quitado'], {
    message: 'status deve ser pendente, parcial ou quitado',
  })
  status!: typeStatus
}
