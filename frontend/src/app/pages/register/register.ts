import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  full_name = '';
  successMessage = '';
  errorMessage = '';

  register(): void {
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password,
      full_name: this.full_name
    }).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (err) => {
        if (err.error) {
          this.errorMessage = JSON.stringify(err.error);
        } else {
          this.errorMessage = 'Registration failed';
        }
      }
    });
  }
}
