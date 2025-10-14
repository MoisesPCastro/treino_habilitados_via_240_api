import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'
import { CreateAlunoDto } from './dto/create-aluno.dto'
import { UpdateAlunoDto } from './dto/update-aluno.dto'
import { MessageEnum } from './../common/enums/message.enum';
import { Aluno } from './entities/aluno.entity';
import { Prisma } from '@prisma/client';

interface IResponseCreated { message: MessageEnum, id: string }

@Injectable()
export class AlunoService {
  constructor(private readonly prisma: PrismaService) { }

  private msgAlunoNaoEncontrado(id: string): string {

    return `Aluno com id ${id} não encontrado`
  }

  async create(createAlunoDto: CreateAlunoDto): Promise<IResponseCreated> {

    const aluno = await this.prisma.aluno.create({
      data: createAlunoDto,
    })
    return { message: MessageEnum.CREATED, id: aluno.id }
  }
  async findAll(filters?: { nome?: string; cpf?: string }): Promise<Aluno[]> {
    const where: any = {}
    const conditions: Prisma.Sql[] = []

    if (filters?.nome) {
      conditions.push(
        Prisma.sql`LOWER(nome) LIKE ${'%' + filters.nome.toLowerCase() + '%'}`
      )
    }

    if (filters?.cpf) {
      where.cpf = {
        contains: filters.cpf,
      }
    }

    const alunos = await this.prisma.aluno.findMany({
      where,
      take: 20,
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

  async getDetalhes(id: string) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id },
      include: {
        aulas: true,
        pagamentos: true,
      },
    });

    if (!aluno) throw new NotFoundException('Aluno não encontrado');

    return {
      aluno: {
        id: aluno.id,
        nome: aluno.nome,
        cpf: aluno.cpf,
        endereco: aluno.endereco,
        telefone: aluno.telefone,
        email: aluno.email,
        numeroCNH: aluno.numeroCarteiraHabilitacao,
        categoriaCnh: aluno.categoriaCnh,
        status: aluno.status,
      },
      aulas: {
        lista: aluno.aulas,
        totalAulas: aluno.totalAulas,
        aulasConcluidas: aluno.aulasConcluidas,
      }, pagamentos: aluno.pagamentos,
    };
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
