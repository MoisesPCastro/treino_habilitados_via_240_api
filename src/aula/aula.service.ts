import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateAulaDto } from './dto/create-aula.dto'
import { UpdateAulaDto } from './dto/update-aula.dto'

import { Aula } from '@prisma/client'
import { MessageEnum } from '../common/enums/message.enum'

@Injectable()
export class AulaService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createAulaDto: CreateAulaDto): Promise<MessageEnum> {
    try {

      const dataBase = new Date(createAulaDto.data)
      if (isNaN(dataBase.getTime())) {
        throw new Error('Data inválida. Use formato ISO ou YYYY-MM-DD')
      }

      const aluno = await this.prisma.aluno.findUnique({
        where: { id: createAulaDto.alunoId },
      })
      if (!aluno) {
        throw new NotFoundException('Aluno não encontrado')
      }

      const duracaoFinal = createAulaDto.duracao ?? 50
      const dataCompleta = new Date(`${createAulaDto.data}T${createAulaDto.hora}:00Z`)

      await this.prisma.aula.create({
        data: {
          alunoId: createAulaDto.alunoId,
          data: dataCompleta,
          hora: createAulaDto.hora,
          duracao: duracaoFinal,
          status: createAulaDto.status,
          paga: createAulaDto.paga,
          observacoes: createAulaDto.observacoes,
        },
      })

      return MessageEnum.CREATED
    } catch (error) {
      console.error('❌ Erro ao criar aula:', error)
      throw new InternalServerErrorException('Erro ao criar aula')
    }
  }

  async findAll(): Promise<Aula[]> {
    return this.prisma.aula.findMany({
      include: {
        aluno: {
          select: { nome: true, categoriaCnh: true },
        },
      },
      orderBy: { data: 'desc' },
    })
  }

  async findOne(id: string): Promise<Aula> {
    const aula = await this.prisma.aula.findUnique({
      where: { id },
      include: {
        aluno: {
          select: { nome: true, categoriaCnh: true, telefone: true },
        },
      },
    })

    if (!aula) throw new NotFoundException(`Aula com id ${id} não encontrada`)
    return aula
  }

  async update(id: string, updateAulaDto: UpdateAulaDto): Promise<MessageEnum> {
    const aulaExistente = await this.prisma.aula.findUnique({ where: { id } })
    if (!aulaExistente) throw new NotFoundException(`Aula com id ${id} não encontrada`)

    await this.prisma.aula.update({
      where: { id },
      data: updateAulaDto,
    })

    return MessageEnum.UPDATED
  }

  async remove(id: string): Promise<MessageEnum> {
    const aulaExistente = await this.prisma.aula.findUnique({ where: { id } })
    if (!aulaExistente) throw new NotFoundException(`Aula com id ${id} não encontrada`)

    await this.prisma.aula.delete({ where: { id } })
    return MessageEnum.DELETED
  }

  async listarAulasDeHoje() {
    const agora = new Date()

    const inicioDoDia = new Date(agora)
    inicioDoDia.setHours(0, 0, 0, 0)

    const fimDoDia = new Date(agora)
    fimDoDia.setHours(23, 59, 59, 999)

    return this.prisma.aula.findMany({
      where: {
        data: {
          gte: inicioDoDia,
          lte: fimDoDia,
        },
      },
      orderBy: { hora: 'asc' },
      include: {
        aluno: {
          select: {
            nome: true,
            categoriaCnh: true,
            telefone: true,
          },
        },
      },
    })
  }
}
