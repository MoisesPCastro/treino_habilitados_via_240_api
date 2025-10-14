import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common'
import { AlunoService } from './aluno.service'
import { CreateAlunoDto } from './dto/create-aluno.dto'
import { UpdateAlunoDto } from './dto/update-aluno.dto'

@Controller('alunos')
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAlunoDto: CreateAlunoDto) {
    return this.alunoService.create(createAlunoDto)
  }

  @Get()
  findAll(
    @Query('nome') nome?: string,
    @Query('cpf') cpf?: string,
  ) {
    return this.alunoService.findAll({ nome, cpf })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alunoService.findOne(id)
  }

  @Get(':id/detalhes')
  async getDetalhes(@Param('id') id: string) {
    return this.alunoService.getDetalhes(id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlunoDto: UpdateAlunoDto) {
    return this.alunoService.update(id, updateAlunoDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alunoService.remove(id)
  }
}
