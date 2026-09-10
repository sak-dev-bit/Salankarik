import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { LucideSearch, LucideBell, LucideUser, LucideCalendar, LucideLogOut } from '@lucide/angular';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, LucideSearch, LucideBell, LucideUser, LucideCalendar, LucideLogOut],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  currentDate = new Date();
  
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
