import { Component, ViewChild } from '@angular/core';
import { BlockUI } from 'primeng/blockui';

@Component({
  selector: 'app-block-ui',
  templateUrl: './block-ui.component.html',
  styleUrls: ['./block-ui.component.scss']
})
export class BlockUiComponent {
  @ViewChild('pageBlockUI')pageBlockUI: BlockUI;

  blocked: boolean = false;

  // Método para bloquear a página
 startBlock() {
    this.blocked = true;
  }

  // Método para desbloquear a página
  stopBlock() {
    this.blocked = false;
  }  
}
