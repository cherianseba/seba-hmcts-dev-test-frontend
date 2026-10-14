import { type Task, type TaskPayload, type TaskStatus } from '../types/task';
import { getTasks } from '../utils/taskUtils';

async function request<T>(url: string, options?: RequestInit): Promise<T | undefined> {
  const headers = new Headers(options?.headers);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message || `Request failed (${response.status})`);
  }

  const body = await response.text();
  return body ? (JSON.parse(body) as T) : undefined;
}

export async function fetchTasks(): Promise<Task[]> {
  return getTasks(await request<unknown>('/api/tasks'));
}

export async function createTask(payload: TaskPayload): Promise<void> {
  await request<Task>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateTask(id: number | string, payload: TaskPayload): Promise<void> {
  await request<Task>(`/api/tasks/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function updateTaskStatus(id: number | string, status: TaskStatus): Promise<void> {
  await request<void>(`/api/tasks/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteTask(id: number | string): Promise<void> {
  await request<void>(`/api/tasks/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
