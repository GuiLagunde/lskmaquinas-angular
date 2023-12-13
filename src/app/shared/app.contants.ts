export type EnumArray = Array<{value: number, text: string}>;

export const constantTipoFinanceiro: EnumArray = [
    {value: 0, text: 'Despesa'},
    {value: 1, text: 'Receita'}
];

export enum TipoFinanceiroEnum{
    DESPESA = 0,
    RECEITA = 1
}

export const constantStatusPagamento: EnumArray = [
    {value: 0, text: 'Pendente'},
    {value: 1, text: 'Efetuado'},
    {value: 2, text: 'Atrasado'}
];

export const constantStatusServico: EnumArray = [
    {value: 0, text: 'Pendente'},
    {value: 1, text: 'Concluido'},
    {value: 2, text: 'Atrasado'},
    {value: 3, text: 'Em andamento'}
];

