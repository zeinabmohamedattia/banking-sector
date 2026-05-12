import { Injectable, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {



  readonly isLoggedIn = signal<boolean>(!!this.getAdminFromStorage());

  private getAdminFromStorage() {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  }

  login(admin: any): void {
    localStorage.setItem('admin', JSON.stringify(admin));
 
    this.isLoggedIn.set(true);
  }
  logout(): void {
    localStorage.removeItem('admin');
    this.isLoggedIn.set(false);
  }
}