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
  subjects: Subject[] = [];
  errorMessage = '';

  subject = 0;
  title = '';
  description = '';
  deadline = '';
  priority: 'low' | 'medium' | 'high' = 'medium';
  status: 'pending' | 'completed' = 'pending';
  is_completed = false;

  editingId: number | null = null;

  ngOnInit(): void {
    this.loadTasks();
    this.loadSubjects();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (res) => this.tasks = res,
      error: () => this.errorMessage = 'Failed to load tasks'
    });
  }

  loadSubjects(): void {
    this.subjectService.getSubjects().subscribe({
      next: (res) => this.subjects = res,
      error: () => this.errorMessage = 'Failed to load subjects'
    });
  }

  saveTask(): void {
    this.errorMessage = '';

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
          this.resetForm();
          this.loadTasks();
        },
        error: () => this.errorMessage = 'Failed to update task'
      });
    } else {
      this.taskService.createTask(payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadTasks();
        },
        error: () => this.errorMessage = 'Failed to create task'
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
    this.taskService.deleteTask(id).subscribe({
      next: () => this.loadTasks(),
      error: () => this.errorMessage = 'Failed to delete task'
    });
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
