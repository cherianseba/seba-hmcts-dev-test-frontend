import axios, { type AxiosResponse } from 'axios';
import type { Application, Request, Response } from 'express';

const backendUrl = (process.env.TASKS_API_URL || 'http://localhost:4000').replace(/\/$/, '');

async function forward(res: Response, operation: () => Promise<AxiosResponse>): Promise<void> {
  try {
    const response = await operation();
    res.status(response.status).send(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 502;
      const data = error.response?.data;
      res.status(status).send(data || { message: 'The task service is unavailable.' });
      return;
    }

    console.error('Unexpected error while forwarding task API request:', error);
    res.status(500).json({ message: 'An unexpected error occurred.' });
  }
}

function getTaskId(req: Request, res: Response): string | null {
  const taskId = req.params.id;

  if (typeof taskId !== 'string') {
    res.status(400).json({ message: 'Task ID must be a single string.' });
    return null;
  }

  return taskId;
}

export default function (app: Application): void {
  app.get('/api/tasks', (_req: Request, res: Response) => forward(res, () => axios.get(`${backendUrl}/api/tasks`)));

  app.post('/api/tasks', (req: Request, res: Response) =>
    forward(res, () => axios.post(`${backendUrl}/api/tasks`, req.body))
  );

  app.get('/api/tasks/:id', (req: Request, res: Response) => {
    const taskId = getTaskId(req, res);

    if (taskId === null) {
      return;
    }

    return forward(res, () => axios.get(`${backendUrl}/api/tasks/${encodeURIComponent(taskId)}`));
  });

  app.put('/api/tasks/:id', (req: Request, res: Response) => {
    const taskId = getTaskId(req, res);

    if (taskId === null) {
      return;
    }

    return forward(res, () => axios.put(`${backendUrl}/api/tasks/${encodeURIComponent(taskId)}`, req.body));
  });

  app.patch('/api/tasks/:id/status', (req: Request, res: Response) => {
    const taskId = getTaskId(req, res);

    if (taskId === null) {
      return;
    }

    return forward(res, () => axios.patch(`${backendUrl}/api/tasks/${encodeURIComponent(taskId)}/status`, req.body));
  });

  app.delete('/api/tasks/:id', (req: Request, res: Response) => {
    const taskId = getTaskId(req, res);

    if (taskId === null) {
      return;
    }

    return forward(res, () => axios.delete(`${backendUrl}/api/tasks/${encodeURIComponent(taskId)}`));
  });
}
