import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReminderService } from '../../services/reminder.service';
import { TaskService } from '../../services/task.service';
import { Reminder } from '../../models/reminder';
import { Task } from '../../models/task';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reminders',
  imports: [FormsModule, RouterLink],
  templateUrl: './reminders.html',
  styleUrl: './reminders.css'
})
export class RemindersComponent {
  private reminderService = inject(ReminderService);
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private router = inject(Router);

  reminders: Reminder[] = [];
  tasks: Task[] = [];
  errorMessage = '';

  task = 0;
  remind_at = '';
  message = '';
  is_sent = false;

  editingId: number | null = null;

  ngOnInit(): void {
    this.loadReminders();
    this.loadTasks();
  }

  loadReminders(): void {
    this.reminderService.getReminders().subscribe({
      next: (res) => this.reminders = res,
      error: () => this.errorMessage = 'Failed to load reminders'
    });
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (res) => this.tasks = res,
      error: () => this.errorMessage = 'Failed to load tasks'
    });
  }

  saveReminder(): void {
    this.errorMessage = '';

    const payload = {
      task: Number(this.task),
      remind_at: this.remind_at,
      message: this.message,
      is_sent: this.is_sent
    };

    if (this.editingId) {
      this.reminderService.updateReminder(this.editingId, payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadReminders();
        },
        error: () => this.errorMessage = 'Failed to update reminder'
      });
    } else {
      this.reminderService.createReminder(payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadReminders();
        },
        error: () => this.errorMessage = 'Failed to create reminder'
      });
    }
  }

  editReminder(reminder: Reminder): void {
    this.editingId = reminder.id;
    this.task = reminder.task;
    this.remind_at = reminder.remind_at.slice(0, 16);
    this.message = reminder.message;
    this.is_sent = reminder.is_sent;
  }

  deleteReminder(id: number): void {
    this.reminderService.deleteReminder(id).subscribe({
      next: () => this.loadReminders(),
      error: () => this.errorMessage = 'Failed to delete reminder'
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.task = 0;
    this.remind_at = '';
    this.message = '';
    this.is_sent = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
