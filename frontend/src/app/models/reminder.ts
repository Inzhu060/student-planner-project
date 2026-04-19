export interface Reminder {
  id: number;
  task: number;
  task_title: string;
  remind_at: string;
  message: string;
  is_sent: boolean;
  created_at: string;
}

export interface ReminderCreate {
  task: number;
  remind_at: string;
  message: string;
  is_sent: boolean;
}
