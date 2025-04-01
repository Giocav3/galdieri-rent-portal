import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoModule } from '@jsverse/transloco';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from './dashboard.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

import { BarplotComponent } from 'app/modules/widget/barplot/barplot.component';
import { CardComponent } from 'app/modules/widget/card/card.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    TranslocoModule,
    MatButtonToggleModule,
    NgApexchartsModule,
    MatTabsModule,
    CommonModule,
    BarplotComponent,
    CardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  chartGithubIssues: ApexOptions = {};
  chartStakeholders: ApexOptions;
  chartClients: ApexOptions;
  chartUsers: ApexOptions;
  chartSuppliers: ApexOptions;
  selectedProject: string = 'ACME Corp. Backend App';
  data: any;
  total: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private _dashboardService: DashboardService,  private _router: Router){
    
  }

  log(){
    console.log(this.selectedProject)
  }

  // redirectToAnagrafica(){
  //   this._router.navigate(['/anagrafica']);
  // }

  filterStakeholderByType(type: string): void {
    console.log("ottimo")
    this._router.navigate(['/stakeholders'], {
      queryParams: { type }
    });
  }

  filterStakeholderByType1(query: string): void {
    console.log("ottimo")
    this._router.navigate(['/stakeholders'], {
      queryParams: { query }
    });
  }

  

  ngOnInit(): void {
    this._dashboardService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Store the data
                this.data = data;
                this.total = data.total
                console.log(data)
                // Prepare the chart data
                //this._prepareChartData();
            });

        // Attach SVG fill fixer to all ApexCharts
        // window['Apex'] = {
        //     chart: {
        //         events: {
        //             mounted: (chart: any, options?: any): void => {
        //                 this._fixSvgFill(chart.el);
        //             },
        //             updated: (chart: any, options?: any): void => {
        //                 this._fixSvgFill(chart.el);
        //             },
        //         },
        //     },
        // };
  }

  ngOnDestroy(): void {
  }

  // private _prepareChartData(): void {

  //   // Assuming you want to use 'this-year' data
  //   const seriesData = this.data.stakeholders.series['this-year'].map(series => ({
  //     name: series.name,
  //     data: series.data.map(point => point.y) // Estrai solo i valori y per il grafico
  //   }));

  //   // Transform the data into the format expected by ApexCharts
  //   const formattedSeries = seriesData.map(series => ({
  //     name: series.name,
  //     data: series.data
  //   }));

  //   // Default series data (empty or with placeholder values)
  //   const defaultSeries = [{
  //     name: 'Default Series',
  //     data: [0, 0, 0, 0, 0] // Placeholder data
  //   }];

  //   // Default categories/labels (empty or with placeholder values)
  //   const defaultCategories = ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'];

  //   // Chart configurations with default values
  //   this.chartStakeholders = {
  //     chart: {
  //       type: 'line',
  //       height: 350,
  //       zoom: {
  //         enabled: false
  //       }
  //     },
  //     colors: ['#008FFB', '#00E396'],
  //     dataLabels: {
  //       enabled: false
  //     },
  //     stroke: {
  //       curve: 'straight'
  //     },
  //     series: this.data?.stakeholders?.series || defaultSeries, // Fallback to default series
  //     xaxis: {
  //       type: 'datetime',
  //       categories: this.data?.stakeholders?.labels || defaultCategories // Fallback to default categories
  //     },
  //     yaxis: {
  //       title: {
  //         text: 'Value'
  //       }
  //     },
  //     tooltip: {
  //       x: {
  //         format: 'dd MMM yyyy'
  //       }
  //     },
  //     fill: {
  //       opacity: 1
  //     },
  //     grid: {
  //       row: {
  //         colors: ['#f3f3f3', 'transparent'],
  //         opacity: 0.5
  //       }
  //     }
  //   };

  //   this.chartClients = {
  //     chart: {
  //       animations: {
  //         enabled: false,
  //       },
  //       fontFamily: 'inherit',
  //       foreColor: 'inherit',
  //       height: '100%',
  //       type: 'area',
  //       sparkline: {
  //         enabled: true,
  //       },
  //     },
  //     colors: ['#38BDF8'],
  //     fill: {
  //       colors: ['#38BDF8'],
  //       opacity: 0.5,
  //     },
  //     series: this.data?.stakeholders?.series || defaultSeries, // Fallback to default series
  //     stroke: {
  //       curve: 'smooth',
  //     },
  //     tooltip: {
  //       followCursor: true,
  //       theme: 'dark',
  //     },
  //     xaxis: {
  //       type: 'category',
  //       categories: this.data?.stakeholders?.labels || defaultCategories, // Fallback to default categories
  //     },
  //     yaxis: {
  //       labels: {
  //         formatter: (val): string => val.toString(),
  //       },
  //     },
  //   };

  //   this.chartUsers = {
  //     chart: {
  //       animations: {
  //         enabled: false,
  //       },
  //       fontFamily: 'inherit',
  //       foreColor: 'inherit',
  //       height: '100%',
  //       type: 'area',
  //       sparkline: {
  //         enabled: true,
  //       },
  //     },
  //     colors: ['#38BDF8'],
  //     fill: {
  //       colors: ['#38BDF8'],
  //       opacity: 0.5,
  //     },
  //     series: this.data?.stakeholders?.series || defaultSeries, // Fallback to default series
  //     stroke: {
  //       curve: 'smooth',
  //     },
  //     tooltip: {
  //       followCursor: true,
  //       theme: 'dark',
  //     },
  //     xaxis: {
  //       type: 'category',
  //       categories: this.data?.stakeholders?.labels || defaultCategories, // Fallback to default categories
  //     },
  //     yaxis: {
  //       labels: {
  //         formatter: (val): string => val.toString(),
  //       },
  //     },
  //   };

  //   this.chartSuppliers = {
  //     chart: {
  //       animations: {
  //         enabled: false,
  //       },
  //       fontFamily: 'inherit',
  //       foreColor: 'inherit',
  //       height: '100%',
  //       type: 'area',
  //       sparkline: {
  //         enabled: true,
  //       },
  //     },
  //     colors: ['#38BDF8'],
  //     fill: {
  //       colors: ['#38BDF8'],
  //       opacity: 0.5,
  //     },
  //     series: this.data?.stakeholders?.series || defaultSeries, // Fallback to default series
  //     stroke: {
  //       curve: 'smooth',
  //     },
  //     tooltip: {
  //       followCursor: true,
  //       theme: 'dark',
  //     },
  //     xaxis: {
  //       type: 'category',
  //       categories: this.data?.stakeholders?.labels || defaultCategories, // Fallback to default categories
  //     },
  //     yaxis: {
  //       labels: {
  //         formatter: (val): string => val.toString(),
  //       },
  //     },
  //   };

    
    
  //   const clientsData = this.data.stakeholders.series['this-year'].find(
  //     series => series.name === 'Clients'
  //   );
    
  //   // Estrai i dati per "Users"
  //   const usersData = this.data.stakeholders.series['this-year'].find(
  //     series => series.name === 'Users'
  //   );
    
  //   // Configurazione del grafico per "Clients"
  //   this.chartClients = {
  //     chart: {
  //       animations: {
  //         enabled: false,
  //       },
  //       fontFamily: 'inherit',
  //       foreColor: 'inherit',
  //       height: '100%',
  //       type: 'area',
  //       sparkline: {
  //         enabled: true,
  //       },
  //     },
  //     colors: ['#38BDF8'], // Colore per "Clients"
  //     fill: {
  //       colors: ['#38BDF8'],
  //       opacity: 0.5,
  //     },
  //     series: [
  //       {
  //         name: 'Clients',
  //         data: clientsData.data.map(point => point.y), // Estrai solo i valori y
  //       },
  //     ],
  //     stroke: {
  //       curve: 'smooth',
  //     },
  //     tooltip: {
  //       followCursor: true,
  //       theme: 'dark',
  //     },
  //     xaxis: {
  //       type: 'category',
  //       categories: this.data.stakeholders.labels, // Usa le etichette dell'asse X
  //     },
  //     yaxis: {
  //       labels: {
  //         formatter: (val): string => val.toString(),
  //       },
  //     },
  //   };
    
  //   // Configurazione del grafico per "Users"
  //   this.chartUsers = {
  //     chart: {
  //       animations: {
  //         enabled: false,
  //       },
  //       fontFamily: 'inherit',
  //       foreColor: 'inherit',
  //       height: '100%',
  //       type: 'area',
  //       sparkline: {
  //         enabled: true,
  //       },
  //     },
  //     colors: ['#00E396'], // Colore per "Users"
  //     fill: {
  //       colors: ['#00E396'],
  //       opacity: 0.5,
  //     },
  //     series: [
  //       {
  //         name: 'Users',
  //         data: usersData.data.map(point => point.y), // Estrai solo i valori y
  //       },
  //     ],
  //     stroke: {
  //       curve: 'smooth',
  //     },
  //     tooltip: {
  //       followCursor: true,
  //       theme: 'dark',
  //     },
  //     xaxis: {
  //       type: 'category',
  //       categories: this.data.stakeholders.labels, // Usa le etichette dell'asse X
  //     },
  //     yaxis: {
  //       labels: {
  //         formatter: (val): string => val.toString(),
  //       },
  //     },
  //   };

  //   // // Visitors vs Page Views
  //   // this.chartStakeholdersVsPageViews = {
  //   //     chart: {
  //   //         animations: {
  //   //             enabled: false,
  //   //         },
  //   //         fontFamily: 'inherit',
  //   //         foreColor: 'inherit',
  //   //         height: '100%',
  //   //         type: 'area',
  //   //         toolbar: {
  //   //             show: false,
  //   //         },
  //   //         zoom: {
  //   //             enabled: false,
  //   //         },
  //   //     },
  //   //     colors: ['#64748B', '#94A3B8'],
  //   //     dataLabels: {
  //   //         enabled: false,
  //   //     },
  //   //     fill: {
  //   //         colors: ['#64748B', '#94A3B8'],
  //   //         opacity: 0.5,
  //   //     },
  //   //     grid: {
  //   //         show: false,
  //   //         padding: {
  //   //             bottom: -40,
  //   //             left: 0,
  //   //             right: 0,
  //   //         },
  //   //     },
  //   //     legend: {
  //   //         show: false,
  //   //     },
  //   //     series: this.data.visitorsVsPageViews.series,
  //   //     stroke: {
  //   //         curve: 'smooth',
  //   //         width: 2,
  //   //     },
  //   //     tooltip: {
  //   //         followCursor: true,
  //   //         theme: 'dark',
  //   //         x: {
  //   //             format: 'MMM dd, yyyy',
  //   //         },
  //   //     },
  //   //     xaxis: {
  //   //         axisBorder: {
  //   //             show: false,
  //   //         },
  //   //         labels: {
  //   //             offsetY: -20,
  //   //             rotate: 0,
  //   //             style: {
  //   //                 colors: 'var(--fuse-text-secondary)',
  //   //             },
  //   //         },
  //   //         tickAmount: 3,
  //   //         tooltip: {
  //   //             enabled: false,
  //   //         },
  //   //         type: 'datetime',
  //   //     },
  //   //     yaxis: {
  //   //         labels: {
  //   //             style: {
  //   //                 colors: 'var(--fuse-text-secondary)',
  //   //             },
  //   //         },
  //   //         max: (max): number => max + 250,
  //   //         min: (min): number => min - 250,
  //   //         show: false,
  //   //         tickAmount: 5,
  //   //     },
  //   // };

  //   // // New vs. returning
  //   // this.chartNewVsReturning = {
  //   //     chart: {
  //   //         animations: {
  //   //             speed: 400,
  //   //             animateGradually: {
  //   //                 enabled: false,
  //   //             },
  //   //         },
  //   //         fontFamily: 'inherit',
  //   //         foreColor: 'inherit',
  //   //         height: '100%',
  //   //         type: 'donut',
  //   //         sparkline: {
  //   //             enabled: true,
  //   //         },
  //   //     },
  //   //     colors: ['#3182CE', '#63B3ED'],
  //   //     labels: this.data.newVsReturning.labels,
  //   //     plotOptions: {
  //   //         pie: {
  //   //             customScale: 0.9,
  //   //             expandOnClick: false,
  //   //             donut: {
  //   //                 size: '70%',
  //   //             },
  //   //         },
  //   //     },
  //   //     series: this.data.newVsReturning.series,
  //   //     states: {
  //   //         hover: {
  //   //             filter: {
  //   //                 type: 'none',
  //   //             },
  //   //         },
  //   //         active: {
  //   //             filter: {
  //   //                 type: 'none',
  //   //             },
  //   //         },
  //   //     },
  //   //     tooltip: {
  //   //         enabled: true,
  //   //         fillSeriesColor: false,
  //   //         theme: 'dark',
  //   //         custom: ({
  //   //             seriesIndex,
  //   //             w,
  //   //         }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
  //   //                                             <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
  //   //                                             <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
  //   //                                             <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
  //   //                                         </div>`,
  //   //     },
  //   // };

  //   // // Gender
  //   // this.chartGender = {
  //   //     chart: {
  //   //         animations: {
  //   //             speed: 400,
  //   //             animateGradually: {
  //   //                 enabled: false,
  //   //             },
  //   //         },
  //   //         fontFamily: 'inherit',
  //   //         foreColor: 'inherit',
  //   //         height: '100%',
  //   //         type: 'donut',
  //   //         sparkline: {
  //   //             enabled: true,
  //   //         },
  //   //     },
  //   //     colors: ['#319795', '#4FD1C5'],
  //   //     labels: this.data.gender.labels,
  //   //     plotOptions: {
  //   //         pie: {
  //   //             customScale: 0.9,
  //   //             expandOnClick: false,
  //   //             donut: {
  //   //                 size: '70%',
  //   //             },
  //   //         },
  //   //     },
  //   //     series: this.data.gender.series,
  //   //     states: {
  //   //         hover: {
  //   //             filter: {
  //   //                 type: 'none',
  //   //             },
  //   //         },
  //   //         active: {
  //   //             filter: {
  //   //                 type: 'none',
  //   //             },
  //   //         },
  //   //     },
  //   //     tooltip: {
  //   //         enabled: true,
  //   //         fillSeriesColor: false,
  //   //         theme: 'dark',
  //   //         custom: ({
  //   //             seriesIndex,
  //   //             w,
  //   //         }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
  //   //                                              <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
  //   //                                              <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
  //   //                                              <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
  //   //                                          </div>`,
  //   //     },
  //   // };

  //   // // Age
  //   // this.chartAge = {
  //   //     chart: {
  //   //         animations: {
  //   //             speed: 400,
  //   //             animateGradually: {
  //   //                 enabled: false,
  //   //             },
  //   //         },
  //   //         fontFamily: 'inherit',
  //   //         foreColor: 'inherit',
  //   //         height: '100%',
  //   //         type: 'donut',
  //   //         sparkline: {
  //   //             enabled: true,
  //   //         },
  //   //     },
  //   //     colors: ['#DD6B20', '#F6AD55'],
  //   //     labels: this.data.age.labels,
  //   //     plotOptions: {
  //   //         pie: {
  //   //             customScale: 0.9,
  //   //             expandOnClick: false,
  //   //             donut: {
  //   //                 size: '70%',
  //   //             },
  //   //         },
  //   //     },
  //   //     series: this.data.age.series,
  //   //     states: {
  //   //         hover: {
  //   //             filter: {
  //   //                 type: 'none',
  //   //             },
  //   //         },
  //   //         active: {
  //   //             filter: {
  //   //                 type: 'none',
  //   //             },
  //   //         },
  //   //     },
  //   //     tooltip: {
  //   //         enabled: true,
  //   //         fillSeriesColor: false,
  //   //         theme: 'dark',
  //   //         custom: ({
  //   //             seriesIndex,
  //   //             w,
  //   //         }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
  //   //                                             <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
  //   //                                             <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
  //   //                                             <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
  //   //                                         </div>`,
  //   //     },
  //   // };

  //   // // Language
  //   // this.chartLanguage = {
  //   //     chart: {
  //   //         animations: {
  //   //             speed: 400,
  //   //             animateGradually: {
  //   //                 enabled: false,
  //   //             },
  //   //         },
  //   //         fontFamily: 'inherit',
  //   //         foreColor: 'inherit',
  //   //         height: '100%',
  //   //         type: 'donut',
  //   //         sparkline: {
  //   //             enabled: true,
  //   //         },
  //   //     },
  //   //     colors: ['#805AD5', '#B794F4'],
  //   //     labels: this.data.language.labels,
  //   //     plotOptions: {
  //   //         pie: {
  //   //             customScale: 0.9,
  //   //             expandOnClick: false,
  //   //             donut: {
  //   //                 size: '70%',
  //   //             },
  //   //         },
  //   //     },
  //   //     series: this.data.language.series,
  //   //     states: {
  //   //         hover: {
  //   //             filter: {
  //   //                 type: 'none',
  //   //             },
  //   //         },
  //   //         active: {
  //   //             filter: {
  //   //                 type: 'none',
  //   //             },
  //   //         },
  //   //     },
  //   //     tooltip: {
  //   //         enabled: true,
  //   //         fillSeriesColor: false,
  //   //         theme: 'dark',
  //   //         custom: ({
  //   //             seriesIndex,
  //   //             w,
  //   //         }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
  //   //                                             <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
  //   //                                             <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
  //   //                                             <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
  //   //                                         </div>`,
  //   //     },
  //   // };
  // }

  /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
//   private _fixSvgFill(element: Element): void {
//     // Current URL
//     const currentURL = this._router.url;

//     // 1. Find all elements with 'fill' attribute within the element
//     // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
//     // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
//     Array.from(element.querySelectorAll('*[fill]'))
//         .filter((el) => el.getAttribute('fill').indexOf('url(') !== -1)
//         .forEach((el) => {
//             const attrVal = el.getAttribute('fill');
//             el.setAttribute(
//                 'fill',
//                 `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`
//             );
//         });
// }

}
