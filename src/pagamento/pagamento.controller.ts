import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { PagamentoService } from './pagamento.service'
import { CreatePagamentoDto } from './dto/create-pagamento.dto'
import { UpdatePagamentoDto } from './dto/update-pagamento.dto'
import { typeStatus } from './types'

@Controller('pagamentos')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPagamentoDto: CreatePagamentoDto) {
    return this.pagamentoService.create(createPagamentoDto)
  }

  @Get()
  async findAll() {
    return this.pagamentoService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.pagamentoService.findOne(id)
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: typeStatus) {
    return this.pagamentoService.findByStatus(status)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePagamentoDto: UpdatePagamentoDto) {
    return this.pagamentoService.update(id, updatePagamentoDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.pagamentoService.remove(id)
  }
}
