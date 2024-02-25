import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ChartComponent } from './chart/chart.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'clients',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    ChartComponent,
    MatButtonModule,
    TranslateModule,
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent {
  @Input() clientsDetail!: any;

  constructor(public dialog: MatDialog) {}

  openDialog(clientsDetail: any): void {
    this.dialog.open(DialogComponent, {
      width: '500px',
      data: clientsDetail,
    });
  }
}
