import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common'; // ✅ IMPORTA QUESTO

@Component({
  selector: 'app-barplot',
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './barplot.component.html',
  styleUrl: './barplot.component.scss'
})
export class BarplotComponent {
  data: any;
  

  @Input() chartData: any;
  @Output() barClick = new EventEmitter<string>(); // 🔥

  
  barplot: any


  ngOnInit(): void {

    this.barplot = {
      chart: { type: 'bar', height: '300' },
      colors: ['#6366F1', '#10B981'],
      dataLabels: { enabled: false },
      labels: this.chartData?.labels ?? [],
      legend: { position: 'top' },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: '30%',
        },
      },
      series: [...this.chartData.series.map(s => ({ ...s }))],

      states: { hover: { filter: 'none' } },
      stroke: { width: 2 },
      tooltip: { enabled: true },
      xaxis: {
        categories: this.chartData?.labels ?? [],
      },
    };
  }
  


}
