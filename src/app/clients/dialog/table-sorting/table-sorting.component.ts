import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  OnInit,
} from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';

/**
 * @title Table with sorting
 */
@Component({
  selector: 'table-sorting',
  styleUrls: ['table-sorting.component.scss'],
  templateUrl: 'table-sorting.component.html',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, TranslateModule],
})
export class TableSortingComponent implements OnInit, AfterViewInit {
  @Input() tableData: any;
  dataSource: any;
  displayedColumns: string[] = ['number', 'card_type', 'balance', 'created'];
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.tableData);
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
