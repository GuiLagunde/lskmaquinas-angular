import { Component } from '@angular/core';
import { LskMaquinasENUM } from '../shared/app.routes';
import { Observable, Subject, catchError, switchMap } from 'rxjs';
import { ApiResponse } from '../model/apiresponse.model';
import { MovimentacoesFinanceiras } from '../model/movimentacoesfinanceiras.model';
import { MovimentacoesFinanceirasService } from '../service/movimentacoesfinanceiras.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectMask } from '../shared/app.masks';
import { TipoFinanceiroEnum, constantTipoFinanceiro } from '../shared/app.contants';
import { HttpStatusCode } from '@angular/common/http';




@Component({
  selector: 'app-movimentacoes-financeiras',
  templateUrl: './movimentacoes-financeiras.component.html',
  styleUrls: ['./movimentacoes-financeiras.component.scss']
})
export class MovimentacoesFinanceirasComponent {
  lskMaquinasRotasEnum= LskMaquinasENUM
  private subjectPesquisa : Subject<string> = new Subject<string>() //Proxy para utilizarmos na pesquisa
  private movimentacoesFinanceirasObservable : Observable<ApiResponse>
  movimentacoesFinanceirasList : MovimentacoesFinanceiras[] = [];
  termobusca: string ='';
  datainicio: string='';
  datafim: string='';
  tipo: string='';
  selectedDate: Date = new Date();
  projectMask = new ProjectMask();
  listTipoFinanceiro = constantTipoFinanceiro
  selectTipo :number = null;
  TipoFinanceiroEnum = TipoFinanceiroEnum
  movimentacaoFinanceira : MovimentacoesFinanceiras = new MovimentacoesFinanceiras()

  constructor(private movimentacoesFinanceirasService: MovimentacoesFinanceirasService,
              public router: Router,
             ){                
 
  }

  //Reactive Forms - Sera conectado ao formulario - Conectado ao template.
  formularioPesquisa: FormGroup = new FormGroup({
    'termobusca': new FormControl(null),
    'datainicio': new FormControl(null, [Validators.required]),
    'datafim': new FormControl(null,[Validators.required]),
    'tipo': new FormControl(null)
  })

  //Reactive Forms - Sera conectado ao formulario - Conectado ao template.
  formularioMovimentacoesFinanceiras: FormGroup = new FormGroup({
    'id': new FormControl(null),
    'valor': new FormControl(null, [Validators.required]),
    'data': new FormControl(null,[Validators.required]),
    'descricao': new FormControl(null)
  })

  ngOnInit(): void {
    this.prepareHttpRequest();
    this.makeRequestHttp();
  }

  makeRequestHttp():void{
    this.subjectPesquisa.next("");
  }

  prepareHttpRequest(){
    //Movimentacoes Financeiras
    this.movimentacoesFinanceirasObservable = this.subjectPesquisa
    .pipe(
            switchMap(() => {
            return this.movimentacoesFinanceirasService.getList(this.termobusca,this.datainicio,this.datafim,this.tipo.toString()) 
          }),
          catchError((erro: any) => {
            console.error(erro)
            return new Observable<ApiResponse>(); //Retorna vazio.
          })
        )
  
    this.movimentacoesFinanceirasObservable.subscribe(
      (resposta :ApiResponse ) => {
         this.movimentacoesFinanceirasList = resposta.result; 
      }
    );  
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
              alert(resposta.message)
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

    edit(id : number){
     // this.router.navigate([this.lskMaquinasRotasEnum.CLIENTES + '/cadastro',id])
     }
   
     delete(id: number){
       this.movimentacoesFinanceirasService.delete(id.toString()).subscribe((resposta)=>{
         alert(resposta.message);
         this.makeRequestHttp();
       })
     }

     receitaSelect(){
      this.selectTipo = this.TipoFinanceiroEnum.RECEITA
     }

     despesaSelect(){
      this.selectTipo = this.TipoFinanceiroEnum.DESPESA
     }
}
