import { LskMaquinasENUM } from '../shared/app.routes';
import { Observable, Subject, catchError, switchMap } from 'rxjs';
import { ApiResponse } from '../model/apiresponse.model';
import { MovimentacoesFinanceiras } from '../model/movimentacoesfinanceiras.model';
import { MovimentacoesFinanceirasService } from '../service/movimentacoesfinanceiras.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoFinanceiroEnum, constantTipoFinanceiro } from '../shared/app.contants';
import { HttpStatusCode } from '@angular/common/http';
import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import * as dateFns from 'date-fns';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-movimentacoes-financeiras',
  templateUrl: './movimentacoes-financeiras.component.html',
  styleUrls: ['./movimentacoes-financeiras.component.scss']
})
export class MovimentacoesFinanceirasComponent {
  @ViewChild('modalMovimentacoesFinanceiras', { static: false }) modalMovimentacoesFinanceiras: ElementRef;

  lskMaquinasRotasEnum = LskMaquinasENUM
  private subjectPesquisa: Subject<string> = new Subject<string>() //Proxy para utilizarmos na pesquisa
  private movimentacoesFinanceirasObservable: Observable<ApiResponse>
  movimentacoesFinanceirasList: MovimentacoesFinanceiras[] = [];
  termobusca: string = '';
  datainicio: string = '';
  datafim: string = '';
  tipo: string;
  selectedDate: Date = new Date();
  listTipoFinanceiro = constantTipoFinanceiro
  selectTipo: number = null;
  TipoFinanceiroEnum = TipoFinanceiroEnum
  movimentacaoFinanceira: MovimentacoesFinanceiras = new MovimentacoesFinanceiras();
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  ultimodiaDoMes : Date =dateFns.endOfMonth(new Date())
  primeirodiaDoMes: Date = dateFns.startOfMonth(new Date())
  hoje: Date = new Date()

  constructor(private movimentacoesFinanceirasService: MovimentacoesFinanceirasService,
    public router: Router,
    private renderer2: Renderer2,
    private datePipe: DatePipe
  ) {

  }
  //Reactive Forms - Sera conectado ao formulario - Conectado ao template.
  formularioPesquisa: FormGroup = new FormGroup({
    'termobusca': new FormControl(null),
    'datainicio': new FormControl(this.datePipe.transform(this.primeirodiaDoMes, 'yyyy-MM-dd'), [Validators.required]),
    'datafim': new FormControl(this.datePipe.transform(this.ultimodiaDoMes , 'yyyy-MM-dd'), [Validators.required]),
    'tipo': new FormControl('')
  })

  //Reactive Forms - Sera conectado ao formulario - Conectado ao template.
  formularioMovimentacoesFinanceiras: FormGroup = new FormGroup({
    'id': new FormControl(null),
    'valor': new FormControl(null, [Validators.required]),
    'data': new FormControl(this.datePipe.transform(this.hoje, 'yyyy-MM-dd'), [Validators.required]),
    'descricao': new FormControl(null)
  })

  ngOnInit(): void {
    this.prepareHttpRequest();
    this.makeRequestHttp();
  }

  makeRequestHttp(): void {
    this.subjectPesquisa.next("");
  }

  prepareHttpRequest() {
    //Movimentacoes Financeiras
    this.movimentacoesFinanceirasObservable = this.subjectPesquisa
      .pipe(
        switchMap(() => {
          this.datainicio = this.formularioPesquisa.value.datainicio;
          this.datafim = this.formularioPesquisa.value.datafim;
          this.tipo = !!this.formularioPesquisa.value.tipo ? this.formularioPesquisa.value.tipo : '';
          return this.movimentacoesFinanceirasService.getList(this.termobusca, this.datainicio, this.datafim, this.tipo.toString())
        }),
        catchError((erro: any) => {
          console.error(erro)
          return new Observable<ApiResponse>(); //Retorna vazio.
        })
      )

    this.movimentacoesFinanceirasObservable.subscribe(
      (resposta: ApiResponse) => {
        this.movimentacoesFinanceirasList = resposta.result;
        this.getTotalReceitas();
        this.getTotalDespesas();
        this.getSaldo();
      }
    );
  }
  getTotalReceitas():number{
   let receitas =  this.movimentacoesFinanceirasList.filter((movimentacaoFinanceira)=> movimentacaoFinanceira.tipo === TipoFinanceiroEnum.RECEITA);
   this.totalReceitas =  receitas.map((receita)=>receita.valor).reduce((acumulador,valorAtual) => acumulador + valorAtual,0)
     
   return this.totalReceitas
  }

  getTotalDespesas():number{
    let despesas =  this.movimentacoesFinanceirasList.filter((movimentacaoFinanceira)=> movimentacaoFinanceira.tipo === TipoFinanceiroEnum.DESPESA);
    this.totalDespesas =  despesas.map((receita)=>receita.valor).reduce((acumulador,valorAtual) => acumulador + valorAtual,0)
    
    return this.totalDespesas
   }

   getSaldo():number{
    this.saldo = this.totalReceitas - this.totalDespesas
    return this.saldo
   }

  //Seta as informacoes do tecnico que esta sendo editado
  private setDataFormulario() {
    this.formularioMovimentacoesFinanceiras.setValue({
      id: this.movimentacaoFinanceira.id,
      valor: this.movimentacaoFinanceira.valor,
      data: this.movimentacaoFinanceira.data,
      descricao: this.movimentacaoFinanceira.descricao
    });
    this.selectTipo = this.movimentacaoFinanceira.tipo
  }

  private getDataFormulario(): MovimentacoesFinanceiras {
    let object = new MovimentacoesFinanceiras();
    object.id = this.formularioMovimentacoesFinanceiras.value.id;
    object.valor = this.formularioMovimentacoesFinanceiras.value.valor;
    object.tipo = this.selectTipo;
    object.data = this.formularioMovimentacoesFinanceiras.value.data;
    object.descricao = this.formularioMovimentacoesFinanceiras.value.descricao;

    return object;
  }

  public onSubmit() {
    this.formularioMovimentacoesFinanceiras.updateValueAndValidity();

    if (this.formularioMovimentacoesFinanceiras.status === 'INVALID') {
      this.formularioMovimentacoesFinanceiras.get('valor').markAsTouched();
      this.formularioMovimentacoesFinanceiras.get('data').markAsTouched();

      alert("O Cadastro não foi preenchido corretamente. Verifique!")
    } else { //Form is Valid
      this.movimentacoesFinanceirasService.save(this.getDataFormulario())
        .subscribe({
          next: (resposta: ApiResponse) => {
            if (resposta.status == HttpStatusCode.Ok) {
              this.makeRequestHttp()
              alert(resposta.message)              
              this.movimentacaoFinanceira = new MovimentacoesFinanceiras()
            } else {
              alert(resposta.message)
            }
          },
          error: (error) => {
            alert(error)
          }
        });
    }
  }

  edit(movimentacaoFinanceira: MovimentacoesFinanceiras) {
    this.movimentacaoFinanceira = movimentacaoFinanceira
    this.setDataFormulario();
    this.openModal(movimentacaoFinanceira.tipo);
  }

  delete(id: number) {
    this.movimentacoesFinanceirasService.delete(id.toString()).subscribe((resposta) => {
      alert(resposta.message);
      this.makeRequestHttp();
    })
  }

  receitaSelect() {
    this.selectTipo = this.TipoFinanceiroEnum.RECEITA
  }

  despesaSelect() {
    this.selectTipo = this.TipoFinanceiroEnum.DESPESA
  }

  openModal(tipo: number) {
    if (tipo === this.TipoFinanceiroEnum.RECEITA) {
      this.receitaSelect();
    } else {
      this.despesaSelect();
    }
    const modalElement = this.modalMovimentacoesFinanceiras.nativeElement;
    this.renderer2.addClass(modalElement, 'show');
    this.renderer2.setStyle(modalElement, 'display', 'block');
  }

  defaultValue() {
    this.movimentacaoFinanceira = new MovimentacoesFinanceiras()
    this.formularioMovimentacoesFinanceiras.reset()
    this.formularioMovimentacoesFinanceiras.get('data').setValue(this.datePipe.transform(this.hoje, 'yyyy-MM-dd'));
  }
}
