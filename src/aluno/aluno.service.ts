import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { CreateAlunoDto } from './dto/create-aluno.dto'
import { UpdateAlunoDto } from './dto/update-aluno.dto'
import { MessageEnum } from './../common/enums/message.enum';
import { Aluno } from './entities/aluno.entity';


@Injectable()
export class AlunoService {
  constructor(private readonly prisma: PrismaService) { }

  private msgAlunoNaoEncontrado(id: string): string {

    return `Aluno com id ${id} não encontrado`
  }

  async create(createAlunoDto: CreateAlunoDto): Promise<MessageEnum> {

    const aluno = await this.prisma.aluno.create({
      data: createAlunoDto,
    })
    return MessageEnum.CREATED
  }

  async findAll(): Promise<Aluno[]> {
    const alunos = await this.prisma.aluno.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return alunos
  }

  async findOne(id: string): Promise<Aluno> {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id },
    })

    if (!aluno) throw new NotFoundException(this.msgAlunoNaoEncontrado(id))

    return aluno
  }

  async update(id: string, updateAlunoDto: UpdateAlunoDto): Promise<MessageEnum> {
    const alunoExistente = await this.prisma.aluno.findUnique({ where: { id } })
    if (!alunoExistente) throw new NotFoundException(this.msgAlunoNaoEncontrado(id))

    const alunoAtualizado = await this.prisma.aluno.update({
      where: { id },
      data: updateAlunoDto,
    })

    return MessageEnum.UPDATED
  }

  async remove(id: string): Promise<MessageEnum> {
    const alunoExistente = await this.prisma.aluno.findUnique({ where: { id } })
    if (!alunoExistente) throw new NotFoundException(this.msgAlunoNaoEncontrado(id))

    await this.prisma.aluno.delete({ where: { id } })
    return MessageEnum.DELETED
  }
}
