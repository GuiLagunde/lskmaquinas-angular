import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, Subject, catchError, switchMap } from 'rxjs';
import { BlockUiComponent } from 'src/app/componentes/block-ui/block-ui/block-ui.component';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { Clientes } from 'src/app/model/clientes.model';
import { ClientesService } from 'src/app/service/clientes.service';
import { LskMaquinasENUM } from 'src/app/shared/app.routes';

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.scss'],
  })
export class ClientesListaComponent  {
  @ViewChild('pageBlockUI') pageBlockUI: BlockUiComponent;

  lskMaquinasRotasEnum= LskMaquinasENUM
  private subjectPesquisa : Subject<string> = new Subject<string>() //Proxy para utilizarmos na pesquisa
  private clientesObservable : Observable<ApiResponse>
  clienteList : Clientes[] = [];
  
  constructor(private clientesService: ClientesService,
              public router: Router,
              private messageService: MessageService,
              private cdr: ChangeDetectorRef){ }

  ngAfterViewInit(): void {
    this.prepareHttpRequest();
    this.makeRequestHttp();
    this.cdr.detectChanges();
  }

  makeRequestHttp():void{
    this.subjectPesquisa.next("");
  }
  
  prepareHttpRequest(){
  //Clientes
  this.clientesObservable = this.subjectPesquisa
  .pipe(
          switchMap((termoBusca: string) => {
          this.pageBlockUI.startBlock();
          return this.clientesService.getListLike(termoBusca) 
        }),
        catchError((erro: any) => {
          console.error(erro)
          return new Observable<ApiResponse>(); //Retorna vazio.
        })
      )

  this.clientesObservable.subscribe(
    (resposta :ApiResponse ) => {
       this.clienteList = resposta.result; 
       this.pageBlockUI.stopBlock();
    }
  );  
  }

  edit(id : number){
   this.router.navigate([this.lskMaquinasRotasEnum.CLIENTES + '/cadastro',id])
  }

  delete(id: number){
    this.pageBlockUI.startBlock();
    this.clientesService.delete(id.toString()).subscribe((resposta)=>{
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: resposta.message });
      this.makeRequestHttp();
      this.pageBlockUI.stopBlock();
    })
  }  
}
