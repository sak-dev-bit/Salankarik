import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductsService, Product } from '../products.service';
import { LucideArrowLeft, LucideSave, LucideUpload, LucideTrash2, LucideImage, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LucideArrowLeft, LucideSave, LucideUpload, LucideTrash2, LucideImage, LucideX],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productsService = inject(ProductsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal(false);
  productId = signal<string | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  isUploading = signal(false);
  
  images = signal<any[]>([]);

  form = this.fb.group({
    name: ['', Validators.required],
    sku: ['', Validators.required],
    description: [''],
    basePrice: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required],
    metalType: ['', Validators.required],
    purity: ['', Validators.required],
    weightGrams: [0, [Validators.required, Validators.min(0.1)]],
    isActive: [true]
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(id);
      this.loadProduct(id);
    }
  }

  loadProduct(id: string) {
    this.isLoading.set(true);
    this.productsService.getProduct(id).subscribe({
      next: (res) => {
        this.form.patchValue(res.data);
        if (res.data.images) {
          this.images.set(res.data.images);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        alert('Failed to load product');
        this.router.navigate(['/products']);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const data = this.form.value as Partial<Product>;

    const request$ = this.isEditMode() 
      ? this.productsService.updateProduct(this.productId()!, data)
      : this.productsService.createProduct(data);

    request$.subscribe({
      next: (res) => {
        this.isSaving.set(false);
        if (!this.isEditMode()) {
          // If created, go to edit mode to allow image uploads
          this.router.navigate(['/products', res.data.id, 'edit']);
        } else {
          alert('Product saved successfully');
        }
      },
      error: () => {
        this.isSaving.set(false);
        alert('Failed to save product');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file || !this.productId()) return;

    this.isUploading.set(true);
    this.productsService.uploadImage(this.productId()!, file).subscribe({
      next: (res) => {
        // Append new image
        this.images.update(imgs => [...imgs, res.data]);
        this.isUploading.set(false);
        event.target.value = null; // reset input
      },
      error: () => {
        this.isUploading.set(false);
        alert('Failed to upload image');
        event.target.value = null;
      }
    });
  }
}
