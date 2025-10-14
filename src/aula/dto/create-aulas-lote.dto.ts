// create-aulas-em-lote.dto.ts
import { Type } from 'class-transformer'
import { ValidateNested, ArrayMinSize } from 'class-validator'
import { CreateAulaDto } from './create-aula.dto'

export class CreateAulasEmLoteDto {
  @ValidateNested({ each: true })
  @Type(() => CreateAulaDto)
  @ArrayMinSize(1)
  aulas!: CreateAulaDto[]
}
