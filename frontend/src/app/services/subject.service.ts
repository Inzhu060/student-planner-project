import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, SubjectCreate } from '../models/subject';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/subjects/';

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.apiUrl);
  }

  createSubject(data: SubjectCreate): Observable<Subject> {
    return this.http.post<Subject>(this.apiUrl, data);
  }

  updateSubject(id: number, data: SubjectCreate): Observable<Subject> {
    return this.http.put<Subject>(`${this.apiUrl}${id}/`, data);
  }

  deleteSubject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
