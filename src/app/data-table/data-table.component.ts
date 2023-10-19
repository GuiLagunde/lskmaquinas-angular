import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
  @Input() data: any[] | undefined;
  @Input() columns!: any[];

  get isDataEmpty(): boolean {
    return !this.data || this.data.length === 0;
  }
}
