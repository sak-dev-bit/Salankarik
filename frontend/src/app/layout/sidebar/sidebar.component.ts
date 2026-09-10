import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideLayoutDashboard, LucideShoppingBag, LucideBox, LucideUsers, LucideSettings, LucidePackageOpen } from '@lucide/angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule], // Components are loaded via ngComponentOutlet, no need to add them here unless used directly in template
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  navigation = [
    { name: 'Dashboard', route: '/dashboard', icon: LucideLayoutDashboard },
    { name: 'Orders', route: '/orders', icon: LucideShoppingBag, badge: '12 New' },
    { name: 'Products', route: '/products', icon: LucidePackageOpen },
    { name: 'Inventory', route: '/inventory', icon: LucideBox, badge: '4' },
    { name: 'Customers', route: '/customers', icon: LucideUsers },
    { name: 'Settings', route: '/settings', icon: LucideSettings },
  ];
}
