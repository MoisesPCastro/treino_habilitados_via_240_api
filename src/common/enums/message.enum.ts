export enum MessageEnum {
  CREATED = 'Registro criado com sucesso',
  UPDATED = 'Registro atualizado com sucesso',
  DELETED = 'Registro removido com sucesso',
  NOT_FOUND = 'Registro não encontrado',
  INTERNAL_ERROR = 'Erro interno no servidor'
}

export enum TipoPagamentoEnum {
  CREDITO = 'Credito',
  DEBITO = 'Debito',
  PIX = 'Pix',
  AVISTA = 'Avista',
}

export enum TipoStatusEnum {
  PENDENT = 'pendente',
  PARCIAL = 'parcial',
  QUITADO = 'quitado'
}