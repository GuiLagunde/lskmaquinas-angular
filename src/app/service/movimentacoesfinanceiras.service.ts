import { environment } from "src/environments/environment.development";
import { Service } from "./service";
import { HttpClient } from "@angular/common/http";
import { MovimentacoesFinanceiras } from "../model/movimentacoesfinanceiras.model";
import { Observable, map, retry } from "rxjs";
import { ApiResponse } from "../model/apiresponse.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
  })
export class MovimentacoesFinanceirasService extends Service {
    private baseUrl = `${environment.apiUrl}/movimentacoesfinanceiras`;

    constructor(private http: HttpClient) {
        super();
    }

    save(movimentacaoFinanceira: MovimentacoesFinanceiras): Observable<ApiResponse> {
        return this.http.post<ApiResponse>((this.baseUrl), movimentacaoFinanceira
        ).pipe(
            retry(1)//permite fazer quantas tentativas quiser
        )
    }

    getList(termoBusca: string, datainicio: string, datafim: string, tipo: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(this.baseUrl + '?pesquisa=' + termoBusca + `&datainicio=${datainicio}&datafim=${datafim}&tipo=${tipo}`)
            .pipe(retry(10) //Permite que possamos colocar o número de tentativas
            )
    }

    getOne(id: string): Observable<ApiResponse> {
        return this.http.get(`${this.baseUrl}/${id}`)
            .pipe(retry(10), //Permite que possamos colocar o número de tentativas
                map((resposta: ApiResponse) => resposta)) // Conseguimos assim transformar o retorno para um objeto - Somente o conteudo da resposta
        //Utilizamos o MAP para transformar no objeto esperado.
    }

    delete(id : string) : Observable<ApiResponse>{
        return this.http.delete( `${this.baseUrl}/${id}`)
        .pipe(map((resposta:ApiResponse) => resposta)) // Conseguimos assim transformar o retorno para um objeto - Somente o conteudo da resposta
              //Utilizamos o MAP para transformar no objeto esperado.
    }

    findByServico(id: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(this.baseUrl + '/servico/' + id)
            .pipe(retry(10) //Permite que possamos colocar o número de tentativas
            )
    }
}    