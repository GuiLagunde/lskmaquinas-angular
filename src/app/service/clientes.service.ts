import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Clientes } from '../model/clientes.model';


@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private baseUrl = `${environment.apiUrl}/clientes`; // Substitua pela URL da sua API

  constructor(private http: HttpClient) {}

  getList(): Observable<Clientes[]> {
    return this.http.get<Clientes[]>(this.baseUrl+'/like');
  }
}
