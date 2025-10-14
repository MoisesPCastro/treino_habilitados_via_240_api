import { IsUUID, IsNumber, IsDateString, IsString, Min, IsEnum, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { typeStatus } from '../types'
import { TipoPagamentoEnum, TipoStatusEnum } from '../../common/enums/message.enum'

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

  @IsOptional()
  @IsDateString()
  dataValorPago?: Date

  @IsString()
  @IsOptional()
  tipoPagamento!: string


  @IsEnum(TipoStatusEnum, {
    message: 'status deve ser pendente, parcial ou quitado',
  })
  status!: typeStatus
}
