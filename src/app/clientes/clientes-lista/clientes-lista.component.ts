import { Component, OnInit } from '@angular/core';
import { Clientes } from 'src/app/model/clientes.model';
import { ClientesService } from 'src/app/service/clientes.service';

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.scss']
})
export class ClientesListaComponent implements OnInit{
  clienteList : Clientes[] = []
  columns : any[] = []
  data : any[] = [];
  constructor(private clientesService: ClientesService){

  }
  ngOnInit(): void {
    this.setList()
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
  

  
  // prepareHttpRequest(){
  //   this.clientesObservable = this.subjectPesquisa.pipe(          
  //     switchMap((termoBusca : string) => {
  //       return this.clientesService.getList() // Retorna o ApiResponse.
  //    }),
  //    catchError((erro: any) => {
  //      console.error(erro)
  //      return new Observable<Response>(); //Retorna vazio.
  //    })
  //  )

  //  this.clientesObservable.subscribe((resposta)=>{
  //     this.data = resposta.body
  //  });
  // }
  getList() : Clientes[]{
     this.clientesService.getList().subscribe((resposta) =>{
      return resposta
     })
     return []
  }
  setList(){
    this.clienteList = this.getList();
  }
  
}
