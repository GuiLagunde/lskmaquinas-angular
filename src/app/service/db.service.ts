import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry } from "rxjs";
import { environment } from "src/environments/environment.development";
import { Service } from "./service";

@Injectable({
    providedIn: 'root',
  })
  export class DataBaseService extends Service{
    private baseUrl = `${environment.apiUrl}/backup`; 
  
    constructor(private http: HttpClient) {
      super();
    }
  
    backup(): Observable<String>{
        return this.http.get<String>(this.baseUrl)
        .pipe(retry(1) //Permite que possamos colocar o número de tentativas
            ) 
    }
  }    