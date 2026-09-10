import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { ShellComponent } from './layout/shell/shell.component';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [publicGuard]
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then(m => m.DashboardComponent) 
      },
      {
        path: 'products',
        loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'products/new',
        loadComponent: () => import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: 'products/:id/edit',
        loadComponent: () => import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
