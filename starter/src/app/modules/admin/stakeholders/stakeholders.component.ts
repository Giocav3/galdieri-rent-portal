import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@jsverse/transloco';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { StakeholdersService } from './stakeholders.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'; // questo è fondamentale!
import { ContactsDetailsComponent } from '../stakeholders/details/details.component'; // path corretto
import { ContactsListComponent } from '../anagrafica/list/list.component';


@Component({
  selector: 'app-stakeholders',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    TranslocoModule,
    MatButtonToggleModule,
    NgApexchartsModule,
    CommonModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormsModule,
    MatInputModule,
    ContactsDetailsComponent,
    ContactsListComponent
  ],
  templateUrl: './stakeholders.component.html',
  styleUrl: './stakeholders.component.scss'
})
export class StakeholdersComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private searchSubject: Subject<string> = new Subject<string>();

  tableDataSource = new MatTableDataSource<any>();
  tableDisplayedColumns: string[] = ['type', 'name', 'taxIdentifier', 'matches'];

  filteredStakeholders: any[] = [];
  totalItems = 0;

  stakeholderTypes: string[] = ['Utilizzatore', 'Cliente', 'Dipendente', 'Fornitore'];
  selectedStakeholderType: string = 'Tutti';
  searchQuery: string = '';
  currentPage = 0;
  pageSize = 10;

  constructor(
    private _stakeholdersService: StakeholdersService,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const type = params['type'];
      if (type) this.selectedStakeholderType = type;
      this.fetchFilteredStakeholders(this.selectedStakeholderType, this.searchQuery);
    });

    this.searchSubject
      .pipe(debounceTime(100), distinctUntilChanged(), takeUntil(this._unsubscribeAll))
      .subscribe((query: string) => {
        this.fetchFilteredStakeholders(this.selectedStakeholderType, query);
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onTypeChange(type: string): void {
    this.selectedStakeholderType = type;
    this.currentPage = 0;
    this.fetchFilteredStakeholders(type, this.searchQuery);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.fetchFilteredStakeholders(this.selectedStakeholderType, this.searchQuery);
  }

  fetchFilteredStakeholders(type: string, query: string): void {
    const limit = this.pageSize;
    const skip = this.currentPage * this.pageSize;

    this._stakeholdersService
      .searchStakeholders(type !== 'Tutti' ? type : null, query, limit, skip)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any[]) => {
        this.filteredStakeholders = data;
        this.tableDataSource.data = data;
        this.totalItems = data.length; // o data.total se usi GraphQL con count separato
      });
  }

  selectedStakeholder: any = null;
  openStakeholderDetails(row) {
    console.log("row: ", row)
    this.selectedStakeholder = row;
  }

  

}
