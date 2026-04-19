import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { SubjectService } from '../../services/subject.service';
import { Task } from '../../models/task';
import { Subject } from '../../models/subject';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tasks',
  imports: [FormsModule, RouterLink],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class TasksComponent {
  private taskService = inject(TaskService);
  private subjectService = inject(SubjectService);
  private authService = inject(AuthService);
  private router = inject(Router);

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  subjects: Subject[] = [];
  errorMessage = '';
  successMessage = '';

  subject = 0;
  title = '';
  description = '';
  deadline = '';
  priority: 'low' | 'medium' | 'high' = 'medium';
  status: 'pending' | 'completed' = 'pending';
  is_completed = false;

  editingId: number | null = null;

  filterStatus = 'all';
  sortBy = 'deadline';
  searchTerm = '';

  ngOnInit(): void {
    this.loadTasks();
    this.loadSubjects();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (res) => {
        this.tasks = res;
        this.applyFilters();
      },
      error: () => {
        this.errorMessage = 'Failed to load tasks';
      }
    });
  }

  loadSubjects(): void {
    this.subjectService.getSubjects().subscribe({
      next: (res) => {
        this.subjects = res;
      },
      error: () => {
        this.errorMessage = 'Failed to load subjects';
      }
    });
  }

  saveTask(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      subject: Number(this.subject),
      title: this.title,
      description: this.description,
      deadline: this.deadline,
      priority: this.priority,
      status: this.status,
      is_completed: this.is_completed
    };

    if (this.editingId) {
      this.taskService.updateTask(this.editingId, payload).subscribe({
        next: () => {
          this.successMessage = 'Task updated successfully';
          this.resetForm();
          this.loadTasks();
        },
        error: () => {
          this.errorMessage = 'Failed to update task';
        }
      });
    } else {
      this.taskService.createTask(payload).subscribe({
        next: () => {
          this.successMessage = 'Task created successfully';
          this.resetForm();
          this.loadTasks();
        },
        error: () => {
          this.errorMessage = 'Failed to create task';
        }
      });
    }
  }

  editTask(task: Task): void {
    this.editingId = task.id;
    this.subject = task.subject;
    this.title = task.title;
    this.description = task.description;
    this.deadline = task.deadline.slice(0, 16);
    this.priority = task.priority;
    this.status = task.status;
    this.is_completed = task.is_completed;
  }

  deleteTask(id: number): void {
    const confirmed = window.confirm('Are you sure you want to delete this task?');

    if (!confirmed) {
      return;
    }

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.successMessage = 'Task deleted successfully';
        this.loadTasks();
      },
      error: () => {
        this.errorMessage = 'Failed to delete task';
      }
    });
  }

  markAsCompleted(task: Task): void {
    const payload = {
      subject: task.subject,
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      priority: task.priority,
      status: 'completed' as 'completed',
      is_completed: true
    };

    this.taskService.updateTask(task.id, payload).subscribe({
      next: () => {
        this.successMessage = 'Task marked as completed';
        this.loadTasks();
      },
      error: () => {
        this.errorMessage = 'Failed to update task';
      }
    });
  }

  applyFilters(): void {
    let result = [...this.tasks];

    if (this.searchTerm.trim()) {
      result = result.filter(task =>
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.filterStatus === 'pending') {
      result = result.filter(task => !task.is_completed);
    } else if (this.filterStatus === 'completed') {
      result = result.filter(task => task.is_completed);
    } else if (this.filterStatus === 'high') {
      result = result.filter(task => task.priority === 'high');
    }

    if (this.sortBy === 'deadline') {
      result.sort((a, b) =>
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      );
    } else if (this.sortBy === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (this.sortBy === 'created_at') {
      result.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    this.filteredTasks = result;
  }

  isOverdue(task: Task): boolean {
    return !task.is_completed && new Date(task.deadline) < new Date();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCompletedCount(): number {
    return this.tasks.filter(task => task.is_completed).length;
  }

  getPendingCount(): number {
    return this.tasks.filter(task => !task.is_completed).length;
  }

  getOverdueCount(): number {
    return this.tasks.filter(task => this.isOverdue(task)).length;
  }

  getUpcomingDeadlines(): Task[] {
    return [...this.tasks]
      .filter(task => !task.is_completed)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }

  resetForm(): void {
    this.editingId = null;
    this.subject = 0;
    this.title = '';
    this.description = '';
    this.deadline = '';
    this.priority = 'medium';
    this.status = 'pending';
    this.is_completed = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
