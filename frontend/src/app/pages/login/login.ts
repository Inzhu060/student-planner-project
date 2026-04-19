import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  errorMessage = '';

  login(): void {
    console.log('login clicked');
    console.log('username:', this.username);
    console.log('password:', this.password);

    this.errorMessage = '';

    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        console.log('LOGIN SUCCESS:', res);

        this.authService.saveTokens(res.access, res.refresh);
        this.authService.saveUser(this.username);

        console.log('saved access:', localStorage.getItem('access'));

        this.router.navigate(['/dashboard']).then((ok) => {
          console.log('navigate result:', ok);
        });
      },
      error: (err) => {
        console.log('LOGIN ERROR:', err);
        this.errorMessage =
          err.error?.error ||
          JSON.stringify(err.error) ||
          'Login failed';
      }
    });
  }
}
