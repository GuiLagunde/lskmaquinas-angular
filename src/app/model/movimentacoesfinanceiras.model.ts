import { Servicos } from "./servicos.model";

export class MovimentacoesFinanceiras{
    id: number;
    valor: number;
    tipo: number;
    data: Date;
    descricao: string;
    servico: Servicos;
}