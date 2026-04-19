import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskCreate } from '../models/task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/tasks/';

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(data: TaskCreate): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, data);
  }

  updateTask(id: number, data: TaskCreate): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}${id}/`, data);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
