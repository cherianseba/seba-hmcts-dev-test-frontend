import { app } from '../../main/app';

import axios, { type AxiosResponse } from 'axios';
import request from 'supertest';

describe('Task API proxy', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('lists tasks from the backend', async () => {
    const tasks = [{ id: 1, title: 'Review case', status: 'OPEN' }];
    jest.spyOn(axios, 'get').mockResolvedValue({ status: 200, data: tasks } as AxiosResponse);

    await request(app).get('/api/tasks').expect(200, tasks);
    expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/tasks');
  });

  test('forwards create requests to the backend', async () => {
    const task = {
      title: 'Review case',
      description: '',
      status: 'OPEN',
      dueDateTime: '2026-10-14T15:00:00',
    };
    jest.spyOn(axios, 'post').mockResolvedValue({ status: 201, data: { id: 1, ...task } } as AxiosResponse);

    await request(app)
      .post('/api/tasks')
      .send(task)
      .expect(201, { id: 1, ...task });
    expect(axios.post).toHaveBeenCalledWith('http://localhost:4000/api/tasks', task);
  });

  test('retrieves a task by ID', async () => {
    const task = { id: 12, title: 'Review case', status: 'OPEN' };
    jest.spyOn(axios, 'get').mockResolvedValue({ status: 200, data: task } as AxiosResponse);

    await request(app).get('/api/tasks/12').expect(200, task);
    expect(axios.get).toHaveBeenCalledWith('http://localhost:4000/api/tasks/12');
  });

  test('forwards full task updates', async () => {
    const task = {
      title: 'Review updated case',
      description: 'Check the documents',
      status: 'IN_PROGRESS',
      dueDateTime: '2026-10-14T15:00:00',
    };
    jest.spyOn(axios, 'put').mockResolvedValue({ status: 200, data: { id: 12, ...task } } as AxiosResponse);

    await request(app)
      .put('/api/tasks/12')
      .send(task)
      .expect(200, { id: 12, ...task });
    expect(axios.put).toHaveBeenCalledWith('http://localhost:4000/api/tasks/12', task);
  });

  test('forwards status updates', async () => {
    const updatedTask = { id: 12, title: 'Review case', status: 'COMPLETED' };
    const statusUpdate = { status: 'COMPLETED' };
    jest.spyOn(axios, 'patch').mockResolvedValue({ status: 200, data: updatedTask } as AxiosResponse);

    await request(app).patch('/api/tasks/12/status').send(statusUpdate).expect(200, updatedTask);
    expect(axios.patch).toHaveBeenCalledWith('http://localhost:4000/api/tasks/12/status', statusUpdate);
  });

  test('forwards task deletion', async () => {
    jest.spyOn(axios, 'delete').mockResolvedValue({ status: 204, data: '' } as AxiosResponse);

    await request(app).delete('/api/tasks/12').expect(204);
    expect(axios.delete).toHaveBeenCalledWith('http://localhost:4000/api/tasks/12');
  });

  test('preserves backend errors', async () => {
    jest.spyOn(axios, 'get').mockRejectedValue({
      isAxiosError: true,
      response: { status: 503, data: { message: 'Task service unavailable' } },
    });

    const response = await request(app).get('/api/tasks');
    expect(response.status).toBe(503);
    expect(response.body).toEqual({ message: 'Task service unavailable' });
  });
});
