import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable, tap, catchError, throwError } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Expose signals for reactive state
  public state = signal<AuthState>({
    user: null,
    token: this.getToken(),
    isAuthenticated: !!this.getToken(),
    isLoading: true
  });

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    if (this.state().token) {
      this.fetchProfile().subscribe({
        error: () => this.logout() // Auto logout if token is invalid
      });
    } else {
      this.state.update(s => ({ ...s, isLoading: false }));
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        const token = res.data.access_token;
        this.setToken(token);
        this.state.update(s => ({ ...s, token, isAuthenticated: true }));
      })
    );
  }

  logout(): void {
    this.removeToken();
    this.state.set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    this.router.navigate(['/login']);
  }

  fetchProfile(): Observable<any> {
    this.state.update(s => ({ ...s, isLoading: true }));
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      tap(res => {
        this.state.update(s => ({ ...s, user: res.data, isLoading: false }));
      }),
      catchError(err => {
        this.state.update(s => ({ ...s, isLoading: false }));
        return throwError(() => err);
      })
    );
  }

  private getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  private removeToken(): void {
    localStorage.removeItem('access_token');
  }
}
