import { Component, OnInit } from '@angular/core';
import { Subject, Observable, switchMap, catchError } from 'rxjs';
import { DataBaseService } from '../service/db.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  constructor(private dataBaseService: DataBaseService) {
  }
  ngOnInit(): void {
    this.prepareHttpRequests();
  }

  private subjectPesquisa: Subject<string> = new Subject<string>(); //Proxy para utilizarmos na pesquisa
  private dbObservable: Observable<String>;

  private prepareHttpRequests(): void {
    //Backup
    this.dbObservable = this.subjectPesquisa
      .pipe(
        switchMap(() => {
          return this.dataBaseService.backup()
        }),
        catchError((erro: any) => {
          console.error(erro)
          return new Observable<String>(); //Retorna vazio.
        })
      )

    this.dbObservable.subscribe(
      (resposta: String) => {
        alert(resposta)         
      }
    );
  }

  backup(){
    this.subjectPesquisa.next("")
  }



}
