import {
  Component,
  AfterViewInit,
  Input,
  OnDestroy,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as Highcharts from 'highcharts';
import { SeriesColumnOptions } from 'highcharts';

@Component({
  selector: 'chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  @Input() accountsData!: any[];
  @Input() clientId!: string;

  barChart: Highcharts.Chart | undefined;
  pieChart: Highcharts.Chart | undefined;

  constructor(public translate: TranslateService) {}

  ngAfterViewInit(): void {
    this.renderCharts();
  }

  ngOnDestroy(): void {
    if (this.barChart) {
      this.barChart.destroy();
    }
    if (this.pieChart) {
      this.pieChart.destroy();
    }
  }

  renderCharts(): void {
    this.renderBarChart();
    this.renderPieChart();
  }

  renderBarChart(): void {
    const accountTypes = Array.from(
      new Set(
        this.accountsData.map(
          (account: { card_type: any }) => account.card_type
        )
      )
    );

    const seriesData: Highcharts.SeriesOptionsType[] = accountTypes.map(
      (type: string) => ({
        type: 'column',
        name: type,
        data: this.accountsData
          .filter((account: { card_type: any }) => account.card_type === type)
          .map((account: { balance: any }) => account.balance),
      })
    );

    const options: Highcharts.Options = {
      chart: {
        type: 'column',
        renderTo: `bar-${this.clientId}`,
      },
      title: {
        text: 'Account Balances by Type',
      },
      xAxis: {
        title: {
          text: 'Accounts',
        },
      },
      yAxis: {
        title: {
          text: 'Balance',
        },
      },
      series: seriesData,
    };

    this.barChart = new Highcharts.Chart(options);
  }

  renderPieChart(): void {
    const balanceData = [
      {
        name: 'Balance >= 0',
        y: this.accountsData.filter(
          (account: { balance: number }) => account.balance >= 0
        ).length,
      },
      {
        name: 'Balance < 0',
        y: this.accountsData.filter(
          (account: { balance: number }) => account.balance < 0
        ).length,
      },
    ];

    const options: Highcharts.Options = {
      chart: {
        type: 'pie',
        renderTo: `pie-${this.clientId}`,
      },
      title: {
        text: 'Balance Distribution',
      },
      series: [
        {
          type: 'pie',
          name: 'Balance',
          data: balanceData,
        },
      ],
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
          point: {
            events: {
              click: (event: any) => {
                const selectedBalance =
                  event.point.name === 'Balance >= 0' ? '>= 0' : '< 0';
                this.filterBarChart(selectedBalance);
              },
            },
          },
        },
      },
    };

    this.pieChart = new Highcharts.Chart(options);
  }

  filterBarChart(selectedBalance: string): void {
    if (!this.barChart) {
      return;
    }

    const accountTypes = Array.from(
      new Set(
        this.accountsData.map(
          (account: { card_type: any }) => account.card_type
        )
      )
    );

    const filteredSeriesData: SeriesColumnOptions[] = accountTypes.map(
      (type: string) => {
        const filteredBalances = this.accountsData
          .filter((account: { card_type: any; balance: number }) => {
            return (
              account.card_type === type &&
              (selectedBalance === '>= 0'
                ? account.balance >= 0
                : account.balance < 0)
            );
          })
          .map((account: { balance: any }) => account.balance);

        return {
          type: 'column',
          name: type,
          data: filteredBalances,
        };
      }
    );

    // Update the bar chart with the filtered data
    this.barChart.update({
      series: filteredSeriesData,
    });
  }
}
