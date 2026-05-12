import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private readonly router=inject(Router)
  private readonly authService = inject(AuthService);
  readonly isLoggedIn = this.authService.isLoggedIn;

  isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }
  signOut(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}