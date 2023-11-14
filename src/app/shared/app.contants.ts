export type EnumArray = Array<{value: number, text: string}>;

export const constantTipoFinanceiro: EnumArray = [
    {value: 0, text: 'Despesa'},
    {value: 1, text: 'Receita'}
];

export enum TipoFinanceiroEnum{
    DESPESA = 0,
    RECEITA = 1
}

