import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReminderService } from '../../services/reminder.service';
import { TaskService } from '../../services/task.service';
import { Reminder } from '../../models/reminder';
import { Task } from '../../models/task';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-reminders',
  imports: [FormsModule, RouterLink],
  templateUrl: './reminders.html',
  styleUrl: './reminders.css'
})
export class RemindersComponent implements OnInit {
  private reminderService = inject(ReminderService);
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  reminders: Reminder[] = [];
  tasks: Task[] = [];
  errorMessage = '';
  successMessage = '';

  task = 0;
  remind_at = '';
  message = '';
  is_sent = false;

  editingId: number | null = null;
  notifiedIds: number[] = [];

  ngOnInit(): void {
    this.notificationService.requestPermission();
    this.loadReminders();
    this.loadTasks();

    setInterval(() => {
      this.checkReminders();
    }, 30000);
  }

  loadReminders(): void {
    this.reminderService.getReminders().subscribe({
      next: (res) => {
        this.reminders = res;
      },
      error: () => {
        this.errorMessage = 'Failed to load reminders';
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
  saveReminder(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      task: Number(this.task),
      remind_at: new Date(this.remind_at).toISOString(),
      message: this.message,
      is_sent: this.is_sent
    };

    if (this.editingId) {
      this.reminderService.updateReminder(this.editingId, payload).subscribe({
        next: () => {
          this.successMessage = 'Reminder updated successfully';
          this.resetForm();
          this.loadReminders();
        },
        error: () => {
          this.errorMessage = 'Failed to update reminder';
        }
      });
    } else {
      this.reminderService.createReminder(payload).subscribe({
        next: () => {
          this.successMessage = 'Reminder created successfully';
          this.resetForm();
          this.loadReminders();
        },
        error: () => {
          this.errorMessage = 'Failed to create reminder';
        }
      });
    }
  }

  editReminder(reminder: Reminder): void {
    this.editingId = reminder.id;
    this.task = reminder.task;

    const localDate = new Date(reminder.remind_at);
    this.remind_at = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 16);

    this.message = reminder.message;
    this.is_sent = reminder.is_sent;
  }

  deleteReminder(id: number): void {
    this.reminderService.deleteReminder(id).subscribe({
      next: () => {
        this.successMessage = 'Reminder deleted successfully';
        this.loadReminders();
      },
      error: () => {
        this.errorMessage = 'Failed to delete reminder';
      }
    });
  }

  markAsSent(reminder: Reminder): void {
    const payload = {
      task: reminder.task,
      remind_at: reminder.remind_at,
      message: reminder.message,
      is_sent: true
    };

    this.reminderService.updateReminder(reminder.id, payload).subscribe({
      next: () => {
        this.successMessage = 'Reminder marked as sent';
        this.loadReminders();
      },
      error: () => {
        this.errorMessage = 'Failed to update reminder';
      }
    });
  }

  checkReminders(): void {
    const now = new Date();

    this.reminders.forEach((reminder) => {
      const time = new Date(reminder.remind_at);

      if (
        time <= now &&
        !reminder.is_sent &&
        !this.notifiedIds.includes(reminder.id)
      ) {
        this.notificationService.showNotification(
          'Reminder',
          `${reminder.task_title}: ${reminder.message}`
        );

        this.notifiedIds.push(reminder.id);
        this.markAsSent(reminder);
      }
    });
  }

  getTimeUntil(remind_at: string): string {
    const now = new Date().getTime();
    const time = new Date(remind_at).getTime();
    const diff = time - now;

    if (diff <= 0) {
      return 'Due now';
    }

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `In ${days} day(s)`;
    }

    if (hours > 0) {
      return `In ${hours} hour(s)`;
    }

    return `In ${minutes} minute(s)`;
  }

  getReminderStatus(reminder: Reminder): string {
    return reminder.is_sent ? 'Sent' : 'Pending';
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

