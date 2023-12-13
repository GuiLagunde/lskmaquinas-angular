import { Component, Renderer2 } from '@angular/core';
import { Observable, Subject, catchError, switchMap } from 'rxjs';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { Servicos } from 'src/app/model/servicos.model';
import { LskMaquinasENUM } from 'src/app/shared/app.routes';
import * as dateFns from 'date-fns';
import { ServicosService } from 'src/app/service/servicos.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { constantStatusPagamento, constantStatusServico } from 'src/app/shared/app.contants';
import { ClientesService } from 'src/app/service/clientes.service';
import { Clientes } from 'src/app/model/clientes.model';

@Component({
  selector: 'app-servicos-lista',
  templateUrl: './servicos-lista.component.html',
  styleUrls: ['./servicos-lista.component.scss']
})
export class ServicosListaComponent {

  lskMaquinasRotasEnum = LskMaquinasENUM;
  private subjectPesquisa: Subject<string> = new Subject<string>(); //Proxy para utilizarmos na pesquisa
  private servicosObservable: Observable<ApiResponse>;
  private subjectPesquisaClientes: Subject<string> = new Subject<string>(); //Proxy para utilizarmos na pesquisa
  private clientesObservable: Observable<ApiResponse>;
  servicosList: Servicos[] = [];
  datainicio: string = '';
  datafim: string = '';
  statusPagamento : string = '';
  statusServico: string = '';
  idCliente: string = ''; 
  ultimodiaDoMes : Date =dateFns.endOfMonth(new Date());
  primeirodiaDoMes: Date = dateFns.startOfMonth(new Date());
  statusPagamentoEnum = constantStatusPagamento;
  statusServicoEnum = constantStatusServico;
  listClientes : Array<Clientes>;

  constructor(private servicosService: ServicosService,
    public router: Router,
    private renderer2: Renderer2,
    private datePipe: DatePipe,
    private clientesService: ClientesService
  ) {
  }

  ngOnInit(): void {
    this.prepareHttpRequest();
    this.makeRequestHttp();
  }

   //Reactive Forms - Sera conectado ao formulario - Conectado ao template.
  formularioPesquisa: FormGroup = new FormGroup({
    'datainicio': new FormControl(this.datePipe.transform(this.primeirodiaDoMes, 'yyyy-MM-dd'), [Validators.required]),
    'datafim': new FormControl(this.datePipe.transform(this.ultimodiaDoMes , 'yyyy-MM-dd'), [Validators.required]),
    'status': new FormControl(''),
    'statusPagamento': new FormControl(''),
    'idCliente': new FormControl('')
  })

  makeRequestHttp(): void {
    this.subjectPesquisa.next("");
    this.subjectPesquisaClientes.next("");
  }

  prepareHttpRequest() {
    //Servico
    this.servicosObservable = this.subjectPesquisa
      .pipe(
        switchMap(() => {
          this.datainicio = this.formularioPesquisa.value.datainicio;
          this.datafim = this.formularioPesquisa.value.datafim;
          this.statusPagamento = !!this.formularioPesquisa.value.statusPagamento ? this.formularioPesquisa.value.statusPagamento : '';
          this.statusServico = !!this.formularioPesquisa.value.statusServico ? this.formularioPesquisa.value.statusServico : '';
          this.idCliente = !!this.formularioPesquisa.value.idCliente ? this.formularioPesquisa.value.idCliente : '';
          return this.servicosService.getList(this.datainicio, this.datafim, this.statusPagamento,this.statusServico,this.idCliente)
        }),
        catchError((erro: any) => {
          console.error(erro)
          return new Observable<ApiResponse>(); //Retorna vazio.
        })
      )

    this.servicosObservable.subscribe(
      (resposta: ApiResponse) => {
        this.listClientes = resposta.result;
      }
    );

     //Clientes
     this.clientesObservable = this.subjectPesquisaClientes
     .pipe(
       switchMap(() => { 
         return this.clientesService.getListLike("")
       }),
       catchError((erro: any) => {
         console.error(erro)
         return new Observable<ApiResponse>(); //Retorna vazio.
       })
     )

   this.servicosObservable.subscribe(
     (resposta: ApiResponse) => {
       this.servicosList = resposta.result;
     }
   );
  }

  edit(id: number) {
    this.router.navigate([this.lskMaquinasRotasEnum.SERVICOS + '/cadastro',id])
  }

  delete(id: number) {
    this.servicosService.delete(id.toString()).subscribe((resposta) => {
      alert(resposta.message);
      this.makeRequestHttp();
    })
  }

  getStatusServico(status: number):string{
    if(status === 0){
      return 'Pendente'
    }else if(status === 1){
      return 'Concluído'
    }else if(status === 2){
      return 'Atrasado'
    }else if(status === 3){
      return 'Em andamento'
    }

    return ''
  }

  getStatusPagamento(status: number):string{
    if(status === 0){
      return 'Pendente'
    }else if(status === 1){
      return 'Efetuado'
    }else if(status === 2){
      return 'Atrasado'
    }
    return''
  }
}
