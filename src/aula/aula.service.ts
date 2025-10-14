import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateAulaDto } from './dto/create-aula.dto'
import { UpdateAulaDto } from './dto/update-aula.dto'

import { Aula } from '@prisma/client'
import { MessageEnum } from '../common/enums/message.enum'
import { IResponseCreated } from './interfeces'

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

  async createMany(aulas: CreateAulaDto[]): Promise<IResponseCreated> {
    try {
      if (!Array.isArray(aulas) || aulas.length === 0) {
        throw new BadRequestException('Nenhuma aula enviada.')
      }

      const primeiroAlunoId = aulas[0].alunoId

      const aluno = await this.prisma.aluno.findUnique({
        where: { id: primeiroAlunoId },
      })

      if (!aluno) {
        throw new NotFoundException('Aluno não encontrado')
      }

      const aulasProntas = aulas.map((aula) => {
        const dataCompleta = new Date(`${aula.data}T${aula.hora}:00Z`)
        return {
          alunoId: aula.alunoId,
          data: dataCompleta,
          hora: aula.hora,
          duracao: aula.duracao ?? 50,
          status: aula.status,
          paga: aula.paga,
          observacoes: aula.observacoes ?? '',
        }
      })

      await this.prisma.aula.createMany({
        data: aulasProntas,
      })

      return { message: MessageEnum.CREATED, data: aulasProntas }
    } catch (error) {
      console.error('❌ Erro ao criar múltiplas aulas:', error)
      throw new InternalServerErrorException('Erro ao criar múltiplas aulas')
    }
  }


  async findAll(filters?: { nome?: string; data?: string, cpf?: string }): Promise<Aula[]> {
    const where: any = {}

    if (filters?.nome) {
      where.aluno = {
        nome: { contains: filters.nome },
      }
    }

    if (filters?.cpf) {
      where.aluno = {
        cpf: { contains: filters.cpf },
      }
    }


    if (filters?.data) {
      const parsedDate = new Date(filters.data)
      if (!isNaN(parsedDate.getTime())) {
        const start = new Date(parsedDate)
        start.setHours(0, 0, 0, 0)

        const end = new Date(parsedDate)
        end.setHours(23, 59, 59, 999)

        where.data = {
          gte: start,
          lte: end,
        }
      }
    }

    return this.prisma.aula.findMany({
      where,
      include: {
        aluno: {
          select: { nome: true, categoriaCnh: true, cpf: true },
        },
      },
      orderBy: { data: 'desc' },
      take: 20,
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
