import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockUiComponent } from './block-ui/block-ui.component';
import { BlockUIModule } from 'primeng/blockui';


@NgModule({
  declarations: [
    // BlockUiComponent
  ],
  imports: [
    CommonModule,
    BlockUIModule
  ],
  exports: [
    // BlockUiComponent
  ]
})
export class BlockUiModule { }
