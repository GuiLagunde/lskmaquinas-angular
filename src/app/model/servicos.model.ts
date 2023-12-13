import { Clientes } from "./clientes.model";
import { Item } from "./item.model";

export class Servicos{
    id: number;
    dataPrevisao: Date;
    data: Date;
    descricao: string;
    valorTotal: number;
    cliente: Clientes;
    statusServico: number;
    statusPagamento: number;
    item: Array<Item>;
    porcentagem: number;
}