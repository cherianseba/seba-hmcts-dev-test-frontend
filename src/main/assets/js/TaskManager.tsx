import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import {
  createTask,
  fetchTasks,
  deleteTask as removeTask,
  updateTaskStatus as saveTaskStatus,
  updateTask,
} from './store/taskStore';
import { type Task, type TaskFormValues, type TaskPayload, type TaskStatus } from './types/task';

import { type FormEvent, type ReactElement, useEffect, useState } from 'react';

const emptyForm: TaskFormValues = { title: '', description: '', status: 'OPEN', dueDate: '' };

function toFormDate(dueDate: string): string {
  return dueDate ? dueDate.slice(0, 16) : '';
}

function TaskManager(): ReactElement {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<TaskFormValues>(emptyForm);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState<number | string | null>(null);
  const [error, setError] = useState('');

  async function loadTasks() {
    try {
      setTasks(await fetchTasks());
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load tasks.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, []);

  function openCreateDialog() {
    setEditingTask(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
    setError('');
  }

  function openEditDialog(task: Task) {
    setEditingTask(task);
    setIsDialogOpen(true);
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      dueDate: toFormDate(task.dueDateTime),
    });
    setError('');
  }

  function closeDialog() {
    setIsDialogOpen(false);
    setEditingTask(null);
    setForm(emptyForm);
  }

  async function saveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError('');

    const payload: TaskPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      dueDateTime: `${form.dueDate}:00`,
    };

    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload);
      } else {
        await createTask(payload);
      }

      closeDialog();
      await loadTasks();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save task.');
    } finally {
      setIsSaving(false);
    }
  }

  async function updateStatus(id: number | string, status: TaskStatus) {
    setBusyTaskId(id);
    setError('');

    try {
      await saveTaskStatus(id, status);
      await loadTasks();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Unable to update task.');
    } finally {
      setBusyTaskId(null);
    }
  }

  async function deleteTask(task: Task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      return;
    }

    setBusyTaskId(task.id);
    setError('');

    try {
      await removeTask(task.id);
      await loadTasks();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete task.');
    } finally {
      setBusyTaskId(null);
    }
  }

  const visibleTasks = tasks.filter(task =>
    `${task.title} ${task.description || ''}`.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="task-manager">
      <header className="task-manager__header">
        <div>
          <p className="govuk-caption-l">Caseworker workspace</p>
          <h1 className="govuk-heading-xl">Tasks</h1>
          <p className="govuk-body task-manager__subtitle">Keep track of the work that needs your attention.</p>
        </div>
        <button className="govuk-button task-manager__add-button" onClick={openCreateDialog} type="button">
          <span aria-hidden="true">+</span> Create task
        </button>
      </header>

      {error && (
        <div className="govuk-error-summary task-manager__error" role="alert" aria-live="assertive">
          <div className="govuk-error-summary__body">{error}</div>
        </div>
      )}

      <TaskList
        tasks={visibleTasks}
        totalTasks={tasks.length}
        search={search}
        isLoading={isLoading}
        busyTaskId={busyTaskId}
        onSearchChange={setSearch}
        onStatusChange={(id, status) => void updateStatus(id, status)}
        onEdit={openEditDialog}
        onDelete={task => void deleteTask(task)}
      />

      <TaskForm
        isOpen={isDialogOpen}
        isEditing={editingTask !== null}
        isSaving={isSaving}
        error={error}
        form={form}
        onChange={updates => setForm(previous => ({ ...previous, ...updates }))}
        onSubmit={saveTask}
        onClose={closeDialog}
      />
    </div>
  );
}

export default TaskManager;
