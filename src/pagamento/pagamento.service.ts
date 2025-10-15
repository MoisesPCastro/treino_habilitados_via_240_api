import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePagamentoDto } from './dto/create-pagamento.dto'
import { UpdatePagamentoDto } from './dto/update-pagamento.dto'
import { MessageEnum } from '../common/enums/message.enum'
import { typeStatus } from './types'

@Injectable()
export class PagamentoService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createPagamentoDto: CreatePagamentoDto): Promise<MessageEnum> {
    try {
      const aluno = await this.prisma.aluno.findUnique({
        where: { id: createPagamentoDto.alunoId },
      })

      if (!aluno) throw new NotFoundException('Aluno não encontrado')

      await this.prisma.pagamento.create({
        data: {
          alunoId: createPagamentoDto.alunoId,
          valorTotal: createPagamentoDto.valorTotal,
          valorPago: createPagamentoDto.valorPago,
          dataVencimento: new Date(createPagamentoDto.dataVencimento),
          dataValorPago: createPagamentoDto.dataValorPago ? new Date(createPagamentoDto.dataValorPago) : null,
          tipoPagamento: createPagamentoDto.tipoPagamento,
          status: createPagamentoDto.status,
        },
      })

      return MessageEnum.CREATED
    } catch (error) {
      console.error('❌ Erro ao criar pagamento:', error)
      throw new InternalServerErrorException('Erro ao criar pagamento')
    }
  }

  async findAll(filters?: { nome?: string; cpf?: string; dataVencimento?: string }) {
    const where: any = {}

    // 🔍 Filtro por nome do aluno
    if (filters?.nome) {
      where.aluno = {
        nome: { contains: filters.nome },
      }
    }

    // 🔍 Filtro por CPF
    if (filters?.cpf) {
      where.aluno = {
        ...where.aluno,
        cpf: { contains: filters.cpf },
      }
    }

    // 📅 Filtro por data de vencimento (formato brasileiro ou ISO)
    if (filters?.dataVencimento) {
      let parsedDate: Date | null = null

      // DD/MM/YYYY → converte
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(filters.dataVencimento)) {
        const [dia, mes, ano] = filters.dataVencimento.split('/')
        parsedDate = new Date(`${ano}-${mes}-${dia}`)
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(filters.dataVencimento)) {
        parsedDate = new Date(filters.dataVencimento)
      }

      if (parsedDate && !isNaN(parsedDate.getTime())) {
        const start = new Date(parsedDate)
        start.setHours(0, 0, 0, 0)

        const end = new Date(parsedDate)
        end.setHours(23, 59, 59, 999)

        where.dataVencimento = {
          gte: start,
          lte: end,
        }
      }
    }

    return this.prisma.pagamento.findMany({
      where,
      include: {
        aluno: {
          select: { nome: true, categoriaCnh: true, telefone: true, cpf: true },
        },
      },
      orderBy: { dataVencimento: 'desc' },
      take: 20,
    })
  }

  async findOne(id: string) {
    const pagamento = await this.prisma.pagamento.findUnique({
      where: { id },
      include: {
        aluno: {
          select: { nome: true, telefone: true },
        },
      },
    })

    if (!pagamento) throw new NotFoundException(`Pagamento ${id} não encontrado`)
    return pagamento
  }

  async findByStatus(status: typeStatus) {
    const pagamentos = await this.prisma.pagamento.findMany({
      where: { status },
      include: {
        aluno: {
          select: { nome: true, categoriaCnh: true, telefone: true },
        },
      },
      orderBy: { dataVencimento: 'asc' },
    })

    return {
      status,
      total: pagamentos.length,
      pagamentos,
    }
  }

  async update(id: string, updatePagamentoDto: UpdatePagamentoDto): Promise<MessageEnum> {
    const pagamentoExistente = await this.prisma.pagamento.findUnique({ where: { id } })
    if (!pagamentoExistente) throw new NotFoundException(`Pagamento ${id} não encontrado`)

    const dataVencimento =
      updatePagamentoDto.dataVencimento &&
        !isNaN(Date.parse(updatePagamentoDto.dataVencimento.toString()))
        ? new Date(updatePagamentoDto.dataVencimento)
        : undefined

    await this.prisma.pagamento.update({
      where: { id },
      data: {
        ...updatePagamentoDto,
        ...(dataVencimento ? { dataVencimento } : {}),
      },
    })

    return MessageEnum.UPDATED
  }

  async remove(id: string): Promise<MessageEnum> {
    const pagamentoExistente = await this.prisma.pagamento.findUnique({ where: { id } })
    if (!pagamentoExistente) throw new NotFoundException(`Pagamento ${id} não encontrado`)

    await this.prisma.pagamento.delete({ where: { id } })
    return MessageEnum.DELETED
  }
}
