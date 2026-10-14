export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
  id: number | string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDateTime: string;
}

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
}

export interface TaskPayload {
  title: string;
  description: string;
  status: TaskStatus;
  dueDateTime: string;
}
