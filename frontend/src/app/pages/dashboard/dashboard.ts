import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private router = inject(Router);

  stats: DashboardStats | null = null;
  tasks: Task[] = [];
  errorMessage = '';
  username = '';

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.loadStats();
    this.loadTasks();
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (res) => {
        this.stats = res;
      },
      error: () => {
        this.errorMessage = 'Failed to load dashboard';
      }
    });
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (res) => {
        this.tasks = res;
      },
      error: () => {
        this.errorMessage = 'Failed to load tasks';
      }
    });
  }

  getUpcomingDeadlines(): Task[] {
    return [...this.tasks]
      .filter(task => !task.is_completed)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }

  getRecentTasks(): Task[] {
    return [...this.tasks]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }

  getProgressPercentage(): number {
    if (!this.stats || this.stats.total_tasks === 0) {
      return 0;
    }

    return Math.round((this.stats.completed_tasks / this.stats.total_tasks) * 100);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isOverdue(task: Task): boolean {
    return !task.is_completed && new Date(task.deadline) < new Date();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
