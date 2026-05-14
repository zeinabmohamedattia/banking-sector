import { computed, Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly admin = signal<any>(this.getAdminFromStorage());

  readonly isLoggedIn = computed(() => !!this.admin());

  getAdminFromStorage() {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  }

  login(adminData: any): boolean {
    localStorage.setItem('admin', JSON.stringify(adminData));

    this.admin.set(adminData);

    return true;
  }

  logout(): void {
    localStorage.removeItem('admin');
    this.admin.set(null);
  }
}