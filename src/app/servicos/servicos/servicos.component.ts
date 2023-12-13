import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable, Subject, catchError, switchMap } from 'rxjs';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { Servicos } from 'src/app/model/servicos.model';
import { ClientesService } from 'src/app/service/clientes.service';
import { ServicosService } from 'src/app/service/servicos.service';

@Component({
  selector: 'app-servicos',
  templateUrl: './servicos.component.html',
  styleUrls: ['./servicos.component.scss']
})
export class ServicosComponent {
  selectedLink: string = 'link1';
  servico: Servicos;

  private subjectPesquisaServicos: Subject<string> = new Subject<string>(); //Proxy para utilizarmos na pesquisa
  private servicosObservable: Observable<ApiResponse>;

  constructor(private servicosService: ServicosService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private clientesService: ClientesService,
    private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.prepareHttpRequests();
 
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
      }
    );
  }
}
