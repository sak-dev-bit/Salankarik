import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  basePrice: number;
  category: string;
  metalType: string;
  purity: string;
  weightGrams: number;
  isActive: boolean;
  images?: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface ProductListResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getProducts(page = 1, limit = 10, search?: string): Observable<ProductListResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<ProductListResponse>(this.apiUrl, { params });
  }

  getProduct(id: string): Observable<{ data: Product }> {
    return this.http.get<{ data: Product }>(`${this.apiUrl}/${id}`);
  }

  createProduct(data: Partial<Product>): Observable<{ data: Product }> {
    return this.http.post<{ data: Product }>(this.apiUrl, data);
  }

  updateProduct(id: string, data: Partial<Product>): Observable<{ data: Product }> {
    return this.http.patch<{ data: Product }>(`${this.apiUrl}/${id}`, data);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadImage(productId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiUrl}/${productId}/images`, formData);
  }
}
