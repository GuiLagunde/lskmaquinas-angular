import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subject, catchError, switchMap } from 'rxjs';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { Clientes } from 'src/app/model/clientes.model';
import { ClientesService } from 'src/app/service/clientes.service';
import { LskMaquinasENUM } from 'src/app/shared/app.routes';

@Component({
  selector: 'app-clientes-cadastro',
  templateUrl: './clientes-cadastro.component.html',
  styleUrls: ['./clientes-cadastro.component.scss']
})
export class ClientesCadastroComponent implements OnInit {
  lskMaquinasRotasEnum = LskMaquinasENUM;

  cliente: Clientes;
  private subjectPesquisaCLientes: Subject<string> = new Subject<string>() //Proxy para utilizarmos na pesquisa
  private clientesObservable: Observable<ApiResponse>
  constructor(private clientesService: ClientesService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder) {
  }

  //Reactive Forms - Sera conectado ao formulario - Conectado ao template.
  formularioClientes: FormGroup = new FormGroup({
    'id': new FormControl(null),
    'nome': new FormControl(null, [Validators.required]),
    'cpf': new FormControl(null),
    'telefone': new FormControl(null, [Validators.required]),
    'endereco': new FormControl(null),
    'cidade': new FormControl(null),
    'cep': new FormControl(null),
    'numeroEndereco': new FormControl(null),
    'bairro': new FormControl(null),
    'email': new FormControl(null)
  })

  ngOnInit(): void {
    this.prepareHttpRequests();

    //Verifica se esta editando ou inserindo um registro
    this.route.params.subscribe((params: Params) => {
      if (params['id'] !== undefined) {
        this.subjectPesquisaCLientes.next(params['id']);
      } else { 
        this.cliente = new Clientes();
      }
    })
  }

  private prepareHttpRequests(): void {
    //Clientes
    this.clientesObservable = this.subjectPesquisaCLientes
      .pipe(
        switchMap((id: string) => {
          return this.clientesService.getOne(id)
        }),
        catchError((erro: any) => {
          console.error(erro)
          return new Observable<ApiResponse>(); //Retorna vazio.
        })
      )

    this.clientesObservable.subscribe(
      (resposta: ApiResponse) => {
        this.cliente = resposta.result;
        this.setDataFormulario();
      }
    );
  }

  //Seta as informacoes do tecnico que esta sendo editado
  private setDataFormulario() {
    this.formularioClientes.setValue({
      id: this.cliente.id,
      nome: this.cliente.nome,
      cpf: this.cliente.cpf,
      telefone: this.cliente.telefone,
      endereco: this.cliente.endereco,
      cidade: this.cliente.cidade,
      cep: this.cliente.cep,
      numeroEndereco: this.cliente.numeroEndereco,
      bairro: this.cliente.bairro,
      email: this.cliente.email
    });
  }

  private getDataFormulario(): Clientes {
    let objectClientes = new Clientes();
    objectClientes.id = this.formularioClientes.value.id;
    objectClientes.nome = this.formularioClientes.value.nome;
    objectClientes.cpf = this.formularioClientes.value.cpf;
    objectClientes.telefone = this.formularioClientes.value.telefone;
    objectClientes.endereco = this.formularioClientes.value.endereco;
    objectClientes.cidade = this.formularioClientes.value.cidade;
    objectClientes.cep = this.formularioClientes.value.cep;
    objectClientes.numeroEndereco = this.formularioClientes.value.cep;
    objectClientes.bairro = this.formularioClientes.value.bairro;
    objectClientes.email = this.formularioClientes.value.email;

    return objectClientes;
  }

  public onSubmit() {
    this.formularioClientes.updateValueAndValidity();

    if (this.formularioClientes.status === 'INVALID') {
      this.formularioClientes.get('nome').markAsTouched();
      this.formularioClientes.get('telefone').markAsTouched();
      
      alert("O Cadastro não foi preenchido corretamente. Verifique!")
    } else { //Form is Valid
      this.clientesService.save(this.getDataFormulario())
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
}
