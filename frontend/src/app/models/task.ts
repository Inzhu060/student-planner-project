export interface Task {
  id: number;
  subject: number;
  subject_name: string;
  title: string;
  description: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  is_completed: boolean;
  created_at: string;
}

export interface TaskCreate {
  subject: number;
  title: string;
  description: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  is_completed: boolean;
}
