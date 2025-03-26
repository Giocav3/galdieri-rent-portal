import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@jsverse/transloco';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
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
    MatSlideToggleModule
  ],
  templateUrl: './stakeholders.component.html',
  styleUrl: './stakeholders.component.scss'
})

export class StakeholdersComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  countByType$ = this._stakeholdersService.getStakeholderCountByType();

  chartGithubIssues: ApexOptions = {};
    chartStakeholders: ApexOptions;
    chartClients: ApexOptions;
    chartUsers: ApexOptions;
    chartSuppliers: ApexOptions;
    selectedProject: string = 'ACME Corp. Backend App';
    data: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    filteredStakeholders: any[] = [];
    tableDataSource = new MatTableDataSource<any>();
    tableDisplayedColumns: string[] = ['type', 'name', 'taxIdentifier', 'matches'];
    currentType: string;
    pageSize = 10;
    currentPage = 0;
    selectedStakeholderType: string = '';
    
    
    
    constructor(
      private _stakeholdersService: StakeholdersService,  
      private _router: Router,
      private route: ActivatedRoute
    ){}
  
    log(){
      console.log(this.selectedProject)
    }
  
    redirectToAnagrafica(){
      this._router.navigate(['/anagrafica']);
    }
  
    // ngOnInit(): void {
    //   this._stakeholdersService.data$
    //     .pipe(takeUntil(this._unsubscribeAll))
    //     .subscribe((data) => {
    //         this.data = data;
    //         console.log(data)
    //     });
    // }

    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        const type = params['type'];
        if (type) {
          this.selectedStakeholderType = type;
          this._stakeholdersService.getStakeholdersWithSharedTaxIdentifier(type, this.pageSize, 0).subscribe((data) => {
            this.filteredStakeholders = data;
            this.tableDataSource.data = data;
          });
        }
      });
    }

    
  
    ngOnDestroy(): void {
    }

    toggleCompleted(event) {

    }

    

    // filterByType(type: string): void {
    //   this.currentType = type;
    //   this.selectedStakeholderType = type;
    
    //   const skip = this.currentPage * this.pageSize;
    
    //   this._stakeholdersService.getStakeholdersByType(type, this.pageSize, skip).subscribe((data) => {
    //     this.filteredStakeholders = data;
    //     this.tableDataSource.data = data;
    //   });
    // }

    ngAfterViewInit() {
      this.tableDataSource.paginator = this.paginator;
    }
    


    // onPageChange(event: PageEvent): void {
    //   this.pageSize = event.pageSize;
    //   this.currentPage = event.pageIndex;

    //   this.filterByType(this.currentType); // chiamata aggiornata con nuovi offset
    // }



}
