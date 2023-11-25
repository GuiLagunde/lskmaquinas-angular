import { Injectable } from "@angular/core";
import { Service } from "./service";
import { environment } from "src/environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Servicos } from "../model/servicos.model";
import { Observable, map, retry } from "rxjs";
import { ApiResponse } from "../model/apiresponse.model";

@Injectable({
    providedIn: 'root',
  })
export class ServicosService extends Service {
    private baseUrl = `${environment.apiUrl}/servicos`;

    constructor(private http: HttpClient) {
        super();
    }

    save(servico: Servicos): Observable<ApiResponse> {
        return this.http.post<ApiResponse>((this.baseUrl), servico
        ).pipe(
            retry(1)//permite fazer quantas tentativas quiser
        )
    }

    getList(datainicio: string, datafim: string, statuspagamento: string,statusservico: string, idcliente: string): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(this.baseUrl + '?idcliente=' + idcliente + `&datainicio=${datainicio}&datafim=${datafim}&statusservico=${statusservico}&statuspagamento=${statuspagamento}`)
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

}    