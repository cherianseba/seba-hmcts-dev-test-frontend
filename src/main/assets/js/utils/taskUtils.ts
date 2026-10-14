import { type Task, type TaskStatus } from '../types/task';

export function formatStatus(status: TaskStatus): string {
  switch (status) {
    case 'OPEN':
      return 'To do';
    case 'IN_PROGRESS':
      return 'In progress';
    case 'COMPLETED':
      return 'Done';
  }
}

export function getTasks(response: unknown): Task[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (typeof response === 'object' && response !== null && 'tasks' in response && Array.isArray(response.tasks)) {
    return response.tasks;
  }

  throw new Error('The tasks service returned an invalid response.');
}
