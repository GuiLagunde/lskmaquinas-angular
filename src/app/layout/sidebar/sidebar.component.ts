import { Component } from '@angular/core';
import { LskMaquinasENUM } from 'src/app/shared/app.routes';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  lskRoutes = LskMaquinasENUM


  teste(){
    this.lskRoutes.MOVIMENTACOESFINANCEIRAS
  }
}
