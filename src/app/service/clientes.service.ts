import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, retry } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Clientes } from '../model/clientes.model';
import { ApiResponse } from '../model/apiresponse.model';
import { Service } from './service';

@Injectable({
  providedIn: 'root',
})
export class ClientesService extends Service{
  private baseUrl = `${environment.apiUrl}/clientes`; 

  constructor(private http: HttpClient) {
    super();
  }
  save(cliente : Clientes) : Observable<ApiResponse>{
    return this.http.post<ApiResponse>((this.baseUrl),cliente
     ).pipe(
     retry(1)//permite fazer quantas tentativas quiser
    ) 
  }

 getList(termoBusca: string): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(this.baseUrl+ '?pesquisa='+termoBusca)
    .pipe(retry(10) //Permite que possamos colocar o número de tentativas
        ) 
  }

 getListLike(termoBusca : string): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(
        (this.baseUrl +'/like?pesquisa='+termoBusca))
    .pipe(retry(10), //Permite que possamos colocar o número de tentativas
          map((resposta:ApiResponse) => resposta)) // Conseguimos assim transformar o retorno para um objeto - Somente o conteudo da resposta
          //Utilizamos o MAP para transformar no objeto esperado.
}

getOne(id : string) : Observable<ApiResponse>{
  return this.http.get(`${this.baseUrl}/${id}`)
  .pipe(retry(10), //Permite que possamos colocar o número de tentativas
        map((resposta:ApiResponse) => resposta)) // Conseguimos assim transformar o retorno para um objeto - Somente o conteudo da resposta
        //Utilizamos o MAP para transformar no objeto esperado.
}

delete(id : string) : Observable<ApiResponse>{
  return this.http.delete( `${this.baseUrl}/${id}`)
  .pipe(map((resposta:ApiResponse) => resposta)) // Conseguimos assim transformar o retorno para um objeto - Somente o conteudo da resposta
        //Utilizamos o MAP para transformar no objeto esperado.
}
}
