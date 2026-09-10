import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService, Product } from '../products.service';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LucideSearch, LucidePlus, LucideEdit, LucideTrash2, LucideImage, LucideMoreVertical } from '@lucide/angular';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideSearch, LucidePlus, LucideEdit, LucideTrash2, LucideImage, LucideMoreVertical],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  private productsService = inject(ProductsService);

  readonly Math = Math;

  products = signal<Product[]>([]);
  total = signal(0);
  page = signal(1);
  limit = signal(10);
  isLoading = signal(true);

  searchControl = new FormControl('');

  ngOnInit() {
    this.loadProducts();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.page.set(1);
      this.loadProducts();
    });
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productsService.getProducts(this.page(), this.limit(), this.searchControl.value || undefined)
      .subscribe({
        next: (res) => {
          this.products.set(res.data);
          this.total.set(res.meta.total);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
  }

  changePage(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages()) return;
    this.page.set(newPage);
    this.loadProducts();
  }

  totalPages(): number {
    return Math.ceil(this.total() / this.limit());
  }

  deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productsService.deleteProduct(id).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  getPrimaryImage(product: Product): string | null {
    if (!product.images || product.images.length === 0) return null;
    const primary = product.images.find(img => img.isPrimary);
    return primary ? primary.url : product.images[0].url;
  }
}
