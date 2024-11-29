import { environment } from "src/environments/environment.development";
import { Service } from "./service";
import { HttpClient } from "@angular/common/http";
import { Observable, map, retry } from "rxjs";
import { ApiResponse } from "../model/apiresponse.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
  })
export class RelatoriosService extends Service {
    private baseUrl = `${environment.apiUrl}/relatorios`;

    constructor(private http: HttpClient) {
        super();
    }

    getServico(id: string, type: string): Observable<ApiResponse> {
        return this.http.get(`${this.baseUrl}/servico?id=${id}&type=${type}`)
            .pipe(retry(10), //Permite que possamos colocar o número de tentativas
                map((resposta: ApiResponse) => resposta)) // Conseguimos assim transformar o retorno para um objeto - Somente o conteudo da resposta
        //Utilizamos o MAP para transformar no objeto esperado.
    }
}    