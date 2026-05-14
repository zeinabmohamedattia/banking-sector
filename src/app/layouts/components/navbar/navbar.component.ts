import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit{
  private readonly router=inject(Router)
  private readonly authService = inject(AuthService);
  readonly isLoggedIn = this.authService.isLoggedIn;
  isMenuOpen = signal(false);
  admin = this.authService.admin;
  ngOnInit(): void {
   
  }
  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }
  signOut(): void {
    this.admin.set(null)
    this.authService.logout();
    this.router.navigate(['/']);
  }
}