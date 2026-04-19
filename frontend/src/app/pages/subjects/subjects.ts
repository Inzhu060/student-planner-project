import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../models/subject';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-subjects',
  imports: [FormsModule, RouterLink],
  templateUrl: './subjects.html',
  styleUrl: './subjects.css'
})
export class SubjectsComponent {
  private subjectService = inject(SubjectService);
  private authService = inject(AuthService);
  private router = inject(Router);

  subjects: Subject[] = [];
  errorMessage = '';

  name = '';
  description = '';
  color = 'blue';

  editingId: number | null = null;

  ngOnInit(): void {
    this.loadSubjects();
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

  saveSubject(): void {
    this.errorMessage = '';

    const payload = {
      name: this.name,
      description: this.description,
      color: this.color
    };

    if (this.editingId) {
      this.subjectService.updateSubject(this.editingId, payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadSubjects();
        },
        error: () => {
          this.errorMessage = 'Failed to update subject';
        }
      });
    } else {
      this.subjectService.createSubject(payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadSubjects();
        },
        error: () => {
          this.errorMessage = 'Failed to create subject';
        }
      });
    }
  }

  editSubject(subject: Subject): void {
    this.editingId = subject.id;
    this.name = subject.name;
    this.description = subject.description;
    this.color = subject.color;
  }

  deleteSubject(id: number): void {
    this.subjectService.deleteSubject(id).subscribe({
      next: () => this.loadSubjects(),
      error: () => this.errorMessage = 'Failed to delete subject'
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.name = '';
    this.description = '';
    this.color = 'blue';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
