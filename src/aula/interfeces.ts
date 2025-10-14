import { MessageEnum } from "../common/enums/message.enum";

interface IAulasProntas {
  alunoId: string;
  data: Date;
  hora: string;
  duracao: number;
  status: string;
  paga: boolean;
  observacoes: string;
}

export interface IResponseCreated { message: MessageEnum, data: IAulasProntas []}