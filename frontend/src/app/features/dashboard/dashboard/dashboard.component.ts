import { Component, OnInit, signal, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardKpis } from '../dashboard.service';
import Chart from 'chart.js/auto';
import { LucideSearch, LucideTrendingUp, LucideArrowUpRight, LucidePackage, LucideDiamond, LucideShieldCheck, LucideClock, LucideAlertTriangle } from '@lucide/angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideTrendingUp, LucideArrowUpRight, LucidePackage, LucideDiamond, LucideShieldCheck, LucideClock, LucideAlertTriangle],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private dashboardService = inject(DashboardService);

  kpis = signal<DashboardKpis | null>(null);
  isLoadingKpis = signal(true);
  
  lowStock = signal<any[]>([]);
  recentOrders = signal<any[]>([]);
  topPerformers = signal<any[]>([]);
  
  @ViewChild('revenueChart') revenueChartRef!: ElementRef;
  chartInstance: any;

  ngOnInit() {
    this.dashboardService.getKpis().subscribe({
      next: (res) => {
        // Hydrate with mock data for missing fields
        this.kpis.set({
          ...res.data,
          totalPatrons: 8420,
          avgOrderValue: 14650
        });
        this.isLoadingKpis.set(false);
      },
      error: () => this.isLoadingKpis.set(false)
    });

    this.dashboardService.getLowStock().subscribe(res => this.lowStock.set(res.data || []));
    this.dashboardService.getRecentOrders().subscribe(res => this.recentOrders.set(res.data?.data || []));
    this.dashboardService.getTopPerformersMock().subscribe(data => this.topPerformers.set(data));
  }

  ngAfterViewInit() {
    this.dashboardService.getFinancialTrajectoryMock().subscribe(data => {
      this.initChart(data);
    });
  }

  initChart(data: any[]) {
    if (this.revenueChartRef) {
      const ctx = this.revenueChartRef.nativeElement.getContext('2d');
      
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(212, 175, 55, 0.4)'); // Gold
      gradient.addColorStop(1, 'rgba(212, 175, 55, 0.0)');

      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(d => d.date),
          datasets: [{
            label: 'Revenue',
            data: data.map(d => d.value),
            borderColor: '#1E2756', // Brand Blue
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4, // Smooth curves
            pointBackgroundColor: '#1E2756',
            pointBorderColor: '#FFF',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1E2756',
              padding: 12,
              titleFont: { size: 13 },
              bodyFont: { size: 14, weight: 'bold' },
              displayColors: false,
              callbacks: {
                label: function(context: any) {
                  return '₹' + (context.parsed?.y || 0).toLocaleString('en-IN');
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { display: true, color: '#f3f4f6' },
              border: { display: false },
              ticks: {
                callback: function(value) {
                  return '₹' + Number(value).toLocaleString('en-IN');
                }
              }
            },
            x: {
              grid: { display: false },
              border: { display: false }
            }
          }
        }
      });
    }
  }
}
