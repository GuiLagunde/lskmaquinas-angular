import { DatePipe } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, Observable, switchMap, catchError } from 'rxjs';
import { BlockUiComponent } from 'src/app/componentes/block-ui/block-ui/block-ui.component';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { Clientes } from 'src/app/model/clientes.model';
import { MovimentacoesFinanceiras } from 'src/app/model/movimentacoesfinanceiras.model';
import { Servicos } from 'src/app/model/servicos.model';
import { ClientesService } from 'src/app/service/clientes.service';
import { MovimentacoesFinanceirasService } from 'src/app/service/movimentacoesfinanceiras.service';
import { ServicosService } from 'src/app/service/servicos.service';
import { constantStatusPagamento, constantStatusServico } from 'src/app/shared/app.contants';
import { LskMaquinasENUM } from 'src/app/shared/app.routes';
import { format } from 'date-fns';
import { ProjectFunctions } from 'src/app/shared/app.functions';

@Component({
  selector: 'app-servicos-cadastro',
  templateUrl: './servicos-cadastro.component.html',
  styleUrls: ['./servicos-cadastro.component.scss']
})
export class ServicosCadastroComponent {
  @ViewChild('pageBlockUI') pageBlockUI: BlockUiComponent;

  lskMaquinasRotasEnum = LskMaquinasENUM;
  statusServicoEnum = constantStatusServico;
  statusPagamentoEnum = constantStatusPagamento;
  projectFunctions = new ProjectFunctions();

  servico: Servicos;
  private subjectPesquisaServicos: Subject<string> = new Subject<string>() //Proxy para utilizarmos na pesquisa
  private servicosObservable: Observable<ApiResponse>

  private subjectPesquisaClientes: Subject<string> = new Subject<string>() //Proxy para utilizarmos na pesquisa
  private clientesObservable: Observable<ApiResponse>
  clientesList: Array<Clientes>

  private subjectPesquisaMovimentacoesFinanceiras: Subject<string> = new Subject<string>() //Proxy para utilizarmos na pesquisa
  private movimentacoesFinanceirasObservable: Observable<ApiResponse>
  movimentacoesFinanceirasList: Array<MovimentacoesFinanceiras>

  constructor(private servicosService: ServicosService,
              private route: ActivatedRoute,
              public router: Router,
              private formBuilder: FormBuilder,
              private clientesService: ClientesService,
              private movimentacoesFinanceirasService: MovimentacoesFinanceirasService,
              private datePipe: DatePipe,
              private messageService: MessageService,
              private cdr: ChangeDetectorRef) {}

  //Reactive Forms - Sera conectado ao formulario - Conectado ao template.
  formularioServicos: FormGroup = new FormGroup({
    'id': new FormControl(null),
    'dataPrevisao': new FormControl(null, [Validators.required]),
    'descricao': new FormControl(null, [Validators.required]),
    'valorTotal': new FormControl(null),
    'cliente': new FormControl(null),
    'statusServico': new FormControl(0, [Validators.required]),
    'statusPagamento': new FormControl(0, [Validators.required]),
    'porcentagem': new FormControl(null),
  });

  ngAfterViewInit(): void {
    this.prepareHttpRequests();
    this.subjectPesquisaClientes.next('');
    this.cdr.detectChanges();

    //Verifica se esta editando ou inserindo um registro
    this.route.params.subscribe((params: Params) => {
      if (params['id'] !== undefined) {
        this.subjectPesquisaServicos.next(params['id']);
      } else {
        this.servico = new Servicos();
      }
    })
  }

  private prepareHttpRequests(): void {
    //Servicos
    this.servicosObservable = this.subjectPesquisaServicos
      .pipe(
        switchMap((id: string) => {
          this.pageBlockUI.startBlock();
          return this.servicosService.getOne(id)
        }),
        catchError((erro: any) => {
          console.error(erro)
          return new Observable<ApiResponse>(); //Retorna vazio.
        })
      )

    this.servicosObservable.subscribe(
      (resposta: ApiResponse) => {
        this.servico = resposta.result;
        this.setDataFormulario();  
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

    this.clientesObservable.subscribe(
      (resposta: ApiResponse) => {
        this.clientesList = resposta.result;
        this.pageBlockUI.stopBlock();
      }
    );

    //MovimentacoesFinanceiras
    this.movimentacoesFinanceirasObservable = this.subjectPesquisaMovimentacoesFinanceiras
      .pipe(
        switchMap(() => {
          this.pageBlockUI.startBlock();
          return this.movimentacoesFinanceirasService.findByServico(this.servico.id.toString())
        }),
        catchError((erro: any) => {
          console.error(erro)
          return new Observable<ApiResponse>(); //Retorna vazio.
        })
      )

    this.movimentacoesFinanceirasObservable.subscribe(
      (resposta: ApiResponse) => {
        this.movimentacoesFinanceirasList = resposta.result;
        this.pageBlockUI.stopBlock();
      }
    );
  }

  //Seta as informacoes do tecnico que esta sendo editado
  private setDataFormulario() {
    this.formularioServicos.setValue({
      id: this.servico.id,
      dataPrevisao: format(new Date(this.projectFunctions.addDays(this.servico.dataPrevisao,1)), 'dd/MM/yyyy'),
      descricao: this.servico.descricao,
      valorTotal: this.servico.valorTotal,
      cliente:  !!this.servico.cliente ?  this.servico.cliente.id : null,
      statusServico: this.servico.statusServico,
      statusPagamento: this.servico.statusPagamento,
      porcentagem: this.servico.porcentagem
    });
  }

  private getDataFormulario(): Servicos {
    let objectServicos = new Servicos();
    objectServicos.id = this.formularioServicos.value.id;
    objectServicos.dataPrevisao = !!this.formularioServicos.value.dataPrevisao ? this.projectFunctions.getValidDate(this.formularioServicos.value.dataPrevisao) : null;
    objectServicos.descricao = this.formularioServicos.value.descricao;
    objectServicos.valorTotal = this.formularioServicos.value.valorTotal;

    if(!!this.formularioServicos.value.cliente){
      var cliente = new Clientes();
      cliente.id = this.formularioServicos.value.cliente;
      objectServicos.cliente = cliente;
    }
    
    objectServicos.statusServico = this.formularioServicos.value.statusServico;
    objectServicos.statusPagamento = this.formularioServicos.value.statusPagamento;
    objectServicos.porcentagem = this.formularioServicos.value.porcentagem ? this.formularioServicos.value.porcentagem : 0;

    if(!!this.servico && !!this.servico.id){
      objectServicos.item = this.servico.item
    }

    return objectServicos;
  }

  public onSubmit() {
    this.formularioServicos.updateValueAndValidity();

    if (this.formularioServicos.status === 'INVALID') {
      this.formularioServicos.get('dataPrevisao').markAsTouched();
      this.formularioServicos.get('descricao').markAsTouched();
      this.formularioServicos.get('statusServico').markAsTouched();
      this.formularioServicos.get('statusPagamento').markAsTouched();
            
      this.messageService.add({ severity: 'info', summary: 'Info', detail: "O Cadastro não foi preenchido corretamente. Verifique!" });
    } else { //Form is Valid
      this.pageBlockUI.startBlock();
      this.servicosService.save(this.getDataFormulario())
        .subscribe({
          next: (resposta: ApiResponse) => {
            if (resposta.status == HttpStatusCode.Created) {
              this.pageBlockUI.stopBlock();
              this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: resposta.message });
              this.router.navigate([this.lskMaquinasRotasEnum.SERVICOS + '/cadastro',resposta.result.id])
            } else {
              this.pageBlockUI.stopBlock();
              this.messageService.add({ severity: 'error', summary: 'Erro', detail: resposta.message });
            }
          },
          error: (error) => {
            this.pageBlockUI.stopBlock();
            this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.message });
          }
        });
    }
  }
}
