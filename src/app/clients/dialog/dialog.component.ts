import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TableSortingComponent } from './table-sorting/table-sorting.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatIconModule,
    MatDialogContent,
    TableSortingComponent,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
