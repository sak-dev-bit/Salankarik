import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, delay, of } from 'rxjs';

export interface DashboardKpis {
  totalRevenue: number;
  totalOrders: number;
  todaySales: number;
  todayOrders: number;
  totalPatrons?: number; // mocked
  avgOrderValue?: number; // mocked
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard`;

  getKpis(): Observable<{ data: DashboardKpis }> {
    return this.http.get<{ data: DashboardKpis }>(`${this.apiUrl}/kpis`);
  }

  getLowStock(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/low-stock`);
  }

  getRecentOrders(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/orders?limit=5`);
  }

  // Frontend mock data for complex design elements
  getFinancialTrajectoryMock(): Observable<any> {
    return of([
      { date: 'Oct 01', value: 50000 },
      { date: 'Oct 05', value: 120000 },
      { date: 'Oct 10', value: 140000 },
      { date: 'Oct 15', value: 130000 },
      { date: 'Oct 21', value: 210400 },
      { date: 'Oct 24', value: 124850 }
    ]).pipe(delay(400));
  }

  getTopPerformersMock(): Observable<any> {
    return of([
      { name: 'Gold Lotus Earrings', sku: 'SLK-ER-0104', spec: '18K Yellow Gold', units: 84, revenue: 755916, img: 'https://placehold.co/100x100/FDF6E3/D4AF37?text=ER' },
      { name: 'Pearl Drop Necklace', sku: 'SLK-NK-0291', spec: 'Freshwater Pearl', units: 62, revenue: 929380, img: 'https://placehold.co/100x100/FDF6E3/D4AF37?text=NK' },
      { name: 'Rose Gold Celestial Bracelet', sku: 'SLK-BR-0812', spec: 'Rose Gold & Diamond', units: 51, revenue: 636990, img: 'https://placehold.co/100x100/FDF6E3/D4AF37?text=BR' },
      { name: 'Classic Solitaire Polki Ring', sku: 'SLK-RG-0419', spec: '22K Uncut Polki', units: 28, revenue: 1148000, img: 'https://placehold.co/100x100/FDF6E3/D4AF37?text=RG' },
    ]).pipe(delay(600));
  }
}
