import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AulaService } from './aula.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { CreateAulasEmLoteDto } from './dto/create-aulas-lote.dto';

@Controller('aulas')
export class AulaController {
  constructor(private readonly aulaService: AulaService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateAulaDto | CreateAulaDto[]) {
    if (Array.isArray(body)) {
      return this.aulaService.createMany(body)
    }
    return this.aulaService.create(body)
  }


  @Get('hoje')
  async listarAulasDeHoje() {
    return this.aulaService.listarAulasDeHoje()
  }

  @Get()
  findAll(
    @Query('nome') nome?: string,
    @Query('data') data?: string,
    @Query('cpf') cpf?: string,
  ) {
    return this.aulaService.findAll({ nome, data, cpf })
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aulaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAulaDto: UpdateAulaDto) {
    return this.aulaService.update(id, updateAulaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aulaService.remove(id);
  }
}
