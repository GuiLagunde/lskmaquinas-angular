import { ChangeDetectorRef, Component, Renderer2, ViewChild } from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { BlockUiComponent } from 'src/app/componentes/block-ui/block-ui/block-ui.component';
import { ProjectFunctions } from 'src/app/shared/app.functions';

@Component({
  selector: 'app-servicos-lista',
  templateUrl: './servicos-lista.component.html',
  styleUrls: ['./servicos-lista.component.scss']
})
export class ServicosListaComponent {
  @ViewChild('pageBlockUI') pageBlockUI: BlockUiComponent;

  lskMaquinasRotasEnum = LskMaquinasENUM;
  projectFunctions = new ProjectFunctions();

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
    private clientesService: ClientesService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit(): void {
    this.prepareHttpRequest();
    this.makeRequestHttp();
    this.cdr.detectChanges();
  }

   //Reactive Forms - Sera conectado ao formulario - Conectado ao template.
  formularioPesquisa: FormGroup = new FormGroup({
    'datainicio': new FormControl(this.datePipe.transform(this.primeirodiaDoMes, 'dd/MM/yyyy'), [Validators.required]),
    'datafim': new FormControl(this.datePipe.transform(this.ultimodiaDoMes , 'dd/MM/yyyy'), [Validators.required]),
    'status': new FormControl(''),
    'statusPagamento': new FormControl(''),
    'idCliente': new FormControl('')
  })

  makeRequestHttp(): void {
    this.subjectPesquisa.next("");
    this.subjectPesquisaClientes.next("");
    this.cdr.detectChanges();
  }

  prepareHttpRequest() {
    //Servico
    this.servicosObservable = this.subjectPesquisa
      .pipe(
        switchMap(() => {
          this.pageBlockUI.startBlock();
          this.datainicio = !!this.formularioPesquisa.value.datainicio ? this.projectFunctions.getValidDateList(this.formularioPesquisa.value.datainicio) : '';
          this.datafim = !!this.formularioPesquisa.value.datafim ? this.projectFunctions.getValidDateList(this.formularioPesquisa.value.datafim) : '';          
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
        this.pageBlockUI.stopBlock();
      }
    );

     //Clientes
     this.clientesObservable = this.subjectPesquisaClientes
     .pipe(
       switchMap(() => { 
        this.pageBlockUI.startBlock();
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
        this.pageBlockUI.stopBlock();
     }
   );
  }

  edit(id: number) {
    this.router.navigate([this.lskMaquinasRotasEnum.SERVICOS + '/cadastro',id])
  }

  delete(id: number) {
    this.pageBlockUI.startBlock();
    this.servicosService.delete(id.toString()).subscribe((resposta) => {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: resposta.message });
      this.makeRequestHttp();
      this.pageBlockUI.stopBlock();
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
