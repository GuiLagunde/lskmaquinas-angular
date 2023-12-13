import { DatePipe } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, Observable, catchError, switchMap } from 'rxjs';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { Item } from 'src/app/model/item.model';
import { Servicos } from 'src/app/model/servicos.model';
import { ServicosService } from 'src/app/service/servicos.service';
import { LskMaquinasENUM } from 'src/app/shared/app.routes';

@Component({
  selector: 'app-servicos-itens-cadastro',
  templateUrl: './servicos-itens-cadastro.component.html',
  styleUrls: ['./servicos-itens-cadastro.component.scss']
})
export class ServicosItensCadastroComponent {
  lskMaquinasRotasEnum = LskMaquinasENUM;
  formularioServicosItens: FormGroup ;

  servico: Servicos;
  private subjectPesquisaServicos: Subject<string> = new Subject<string>() //Proxy para utilizarmos na pesquisa
  private servicosObservable: Observable<ApiResponse>
  listFormulario : any;

  constructor(private servicosService: ServicosService,
    private route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe) {
      this.formularioServicosItens = this.fb.group({
        items: this.fb.array([
          this.fb.group({
            'id': [null],
            'nome': [null, [Validators.required]],
            'valorReal': [0, [Validators.required]],
            'valorTotal': [null],
            'porcentagem': [null]
          })
        ])
       });
       this.listFormulario = this.formularioServicosItens.controls['items'].value
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

  private setDataFormularioInicial(index: number) {
    
    let itemControl = (this.formularioServicosItens.get('items') as FormArray).at(index);
    itemControl.setValue({
     'id': null,
     'nome': "Mão de Obra",
     'valorReal': null,
     'valorTotal': null,
     'porcentagem': 0 
    });
    this.listFormulario = this.formularioServicosItens.controls['items'].value; 
  }

  private setDataFormulario(items: Item[]) {
    let itemsControl = this.formularioServicosItens.get('items') as FormArray;
    itemsControl.clear(); // Clear the existing controls
   
    items.forEach(item => {
      itemsControl.push(this.fb.group({
        'id': [item.id],
        'nome': [item.nome],
        'valorReal': [item.valorReal],
        'valorTotal': [item.valorTotal],
        'porcentagem': [item.porcentagem]
      }));
    });
    this.listFormulario = this.formularioServicosItens.controls['items'].value;
  }

    getDataFormulario(): Servicos {
      let items = new Array<Item>();
      let valorTotal = null;
      this.listFormulario = this.formularioServicosItens.controls['items'].value
      this.listFormulario.forEach((itemFormulario)=>{        
        items.push({
          id: itemFormulario.id,
          nome: itemFormulario.nome,
          valorReal: itemFormulario.valorReal,
          porcentagem:itemFormulario.porcentagem,
          valorTotal: (itemFormulario.valorReal + (itemFormulario.valorReal * (itemFormulario.porcentagem / 100)))    
        })
      })
      
      this.servico.item = items;
      this.servico.item.forEach((item)=>{
        valorTotal += item.valorTotal;
      })
      this.servico.valorTotal = valorTotal;

      return this.servico;
  }
  
  public onSubmit() {
    let itemsArray = this.formularioServicosItens.get('items') as FormArray;
    itemsArray.updateValueAndValidity();   

    if (!itemsArray.valid) {
      itemsArray.controls.forEach((control: FormGroup) => {
        control.markAsTouched();
      });
            
      alert("O Cadastro não foi preenchido corretamente. Verifique!")
    } else { //Form is Valid
      this.servicosService.save(this.getDataFormulario())
        .subscribe({
          next: (resposta: ApiResponse) => {
            if (resposta.status == HttpStatusCode.Created) {
              alert(resposta.message)
              this.router.navigate([this.lskMaquinasRotasEnum.SERVICOS + '/cadastro',resposta.result.id])            
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
        if(!!this.servico && Object.keys(this.servico.item).length !== 0){
          this.setDataFormulario(this.servico.item);          
        }else{
          this.setDataFormularioInicial(0)
        }        
      }
    );
  }

  addItem() {
    const items = this.formularioServicosItens.get('items') as FormArray;
    items.push(this.fb.group({
      'id': [null],
      'nome': [null, [Validators.required]],
      'valorReal': [0, [Validators.required]],
      'valorTotal': [null],
      'porcentagem': [this.servico.porcentagem]
    }));
    this.listFormulario = this.formularioServicosItens.controls['items'].value
   }

   removeItem(index: number) {
    const items = this.formularioServicosItens.get('items') as FormArray;
    items.removeAt(index);
   }
}

