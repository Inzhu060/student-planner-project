export interface Subject {
  id: number;
  name: string;
  description: string;
  color: string;
  created_at: string;
}

export interface SubjectCreate {
  name: string;
  description: string;
  color: string;
}
