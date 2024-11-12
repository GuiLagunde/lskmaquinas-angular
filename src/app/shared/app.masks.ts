export class ProjectMask{
    unmaskNumber(value: string): number {
        return Number(value.toString().replace(".", "").replace(",", "."));
    }

    unmaskNumberTelefone(value: string): number {
        return parseInt(value.toString().replace(/\D/g, ''));
    }     
}