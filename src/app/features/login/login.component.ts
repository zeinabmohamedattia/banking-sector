
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  passwordType = signal('password')
  isLoading = signal(false)
  errorMessage = signal('')
  private readonly router = inject(Router)
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^[A-Z].{5,}$/)]],
  });



  submitForm() {

    this.isLoading.set(true);
    this.errorMessage.set('');

    setTimeout(() => {
      const ok = this.authService.login(this.loginForm.value);
      if (ok) {
        this.router.navigate(['/dashboard']);

      } else {
        this.errorMessage.set('Invalid credentials. Please try again.');
        this.isLoading.set(false);
      }
    }, 700);
  }
  toggleShowPassword() {
    if (this.passwordType() == 'password') {

      this.passwordType.set('text')
    }
    else {
      this.passwordType.set('password')
    }

  }

}