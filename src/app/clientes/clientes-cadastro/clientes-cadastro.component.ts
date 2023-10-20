import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, catchError, switchMap } from 'rxjs';
import { Clientes } from 'src/app/model/clientes.model';
import { ClientesService } from 'src/app/service/clientes.service';
import { LskMaquinasENUM } from 'src/app/shared/app.routes';

@Component({
  selector: 'app-clientes-cadastro',
  templateUrl: './clientes-cadastro.component.html',
  styleUrls: ['./clientes-cadastro.component.scss']
})
export class ClientesCadastroComponent implements OnInit{
  lskMaquinasRotasEnum =  LskMaquinasENUM ;
  
  cliente: Clientes;
  private subjectPesquisaCLientes : Subject<string> = new Subject<string>() //Proxy para utilizarmos na pesquisa
  private clientesObservable : Observable<Clientes>
  constructor(private clientesService: ClientesService,
              private route: ActivatedRoute,
              public router: Router,
              private formBuilder: FormBuilder) { 
}

 //Reactive Forms - Sera conectado ao formulario - Conectado ao template.
 public formularioClientes : FormGroup = new FormGroup({
  'id'  : new FormControl(null),        
  'nome': new FormControl(null,[Validators.required]),
  'cpf': new FormControl(null),
  'telefone'  : new FormControl(null, [Validators.required]),
  'endereco'  : new FormControl(null),
  'cidade'  : new FormControl(null),
  'cep'  : new FormControl(null),
  'numeroEndereco'  : new FormControl(null), 
  'bairro' : new FormControl(null),
  'email' : new FormControl(null)   
})

ngOnInit(): void {
  
}

private prepareHttpRequests() : void{
  //Clientes
  this.clientesObservable = this.subjectPesquisaCLientes
  .pipe(
          switchMap((id: string) => {
          return this.clientesService.getOne(id) 
        }),
        catchError((erro: any) => {
          console.error(erro)
          return new Observable<Clientes>(); //Retorna vazio.
        })
      )

  this.clientesObservable.subscribe(
    (cliente :Clientes ) => {
      this.cliente = cliente;
      //this.setDataFormulario();
    }
  );  
  }
}
