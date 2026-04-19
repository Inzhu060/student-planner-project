import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reminder, ReminderCreate } from '../models/reminder';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/reminders/';

  getReminders(): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(this.apiUrl);
  }

  createReminder(data: ReminderCreate): Observable<Reminder> {
    return this.http.post<Reminder>(this.apiUrl, data);
  }

  updateReminder(id: number, data: ReminderCreate): Observable<Reminder> {
    return this.http.put<Reminder>(`${this.apiUrl}${id}/`, data);
  }

  deleteReminder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
