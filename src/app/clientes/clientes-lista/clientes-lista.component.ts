import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, switchMap } from 'rxjs';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { Clientes } from 'src/app/model/clientes.model';
import { ClientesService } from 'src/app/service/clientes.service';
import { LskMaquinasENUM } from 'src/app/shared/app.routes';

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.scss']
})
export class ClientesListaComponent implements OnInit{
  
  columns : any[] = [];
  data : any[] = [];
  lskMaquinasRotasEnum: LskMaquinasENUM
  cliente: Clientes;

  private subjectPesquisa : Subject<string> = new Subject<string>() //Proxy para utilizarmos na pesquisa
  private clientesObservable : Observable<ApiResponse>
  clienteList : Clientes[] = [];
  constructor(private clientesService: ClientesService,
              router: Router,){
                
    this.columns = [
      { prop: 'nome', name: 'Nome' },
      { prop: 'telefone', name: 'Telefone' },
      { prop: 'cpf', name: 'CPF' },
      { prop: 'cidade', name: 'Cidade' },
      { prop: 'id', name: 'ID' }
    ];
    this.clienteList.forEach((cliente)=>{
      this.data.push(
        {prop: 'nome',name:cliente.nome},
        {prop: 'telefone',name:cliente.telefone},
        {prop: 'cpf',name:cliente.cpf},
        {prop: 'cidade',name:cliente.cidade},
        {prop: 'id',name:cliente.id})
    })
  }
  ngOnInit(): void {
    this.prepareHttpRequest();
    this.makeRequestHttp();
    
    
  }

  public makeRequestHttp():void{
    this.subjectPesquisa.next("");
  }
  
  prepareHttpRequest(){
  //Clientes
  this.clientesObservable = this.subjectPesquisa
  .pipe(
          switchMap((termoBusca: string) => {
          return this.clientesService.getList(termoBusca) 
        }),
        catchError((erro: any) => {
          console.error(erro)
          return new Observable<ApiResponse>(); //Retorna vazio.
        })
      )

  this.clientesObservable.subscribe(
    (resposta :ApiResponse ) => {
      this.clienteList = resposta.result.content;
      console.log(this.clienteList)
    }
  );  
  }

  // private getDatatableFilters(): any {
    
  //   let filter = {
  //     datainicio: this.formularioPesquisa.value.datainicio,
  //     datafim: this.formularioPesquisa.value.datafim,
  //     status : this.formularioPesquisa.value.status === 'null' ? null : this.formularioPesquisa.value.status,
  //     experiencia : this.formularioPesquisa.value.experiencia === 'null' ? null : this.formularioPesquisa.value.experiencia
  //   };

  //   //Inclui os filtros
  //   Object.assign(filter, tableFilters);

  //   return filter;
  // }
  
}
