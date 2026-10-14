import { type Task, type TaskStatus } from '../types/task';
import { formatStatus } from '../utils/taskUtils';

import { type ReactElement } from 'react';

const statuses: TaskStatus[] = ['OPEN', 'IN_PROGRESS', 'COMPLETED'];

interface TaskListProps {
  tasks: Task[];
  totalTasks: number;
  search: string;
  isLoading: boolean;
  busyTaskId: number | string | null;
  onSearchChange: (search: string) => void;
  onStatusChange: (id: number | string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate);

  return Number.isNaN(date.getTime())
    ? dueDate
    : new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date);
}

function TaskList({
  tasks,
  totalTasks,
  search,
  isLoading,
  busyTaskId,
  onSearchChange,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskListProps): ReactElement {
  return (
    <>
      <div className="task-toolbar">
        <label className="govuk-label govuk-visually-hidden" htmlFor="task-search">
          Search tasks
        </label>
        <input
          className="govuk-input task-toolbar__search"
          id="task-search"
          type="search"
          placeholder="Search tasks"
          value={search}
          onChange={event => onSearchChange(event.target.value)}
        />
        <span className="govuk-hint task-toolbar__count">
          {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {isLoading ? (
        <p className="govuk-body" role="status">
          Loading tasks…
        </p>
      ) : (
        <section className="task-list-panel" aria-label="Task list">
          <h2 className="task-list-panel__title">Task list</h2>
          <div className="task-table-scroll">
            <table className="task-table">
              <thead>
                <tr>
                  <th scope="col">Title &amp; Description</th>
                  <th scope="col">Due Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td className="task-table__details">
                      <strong>{task.title}</strong>
                      {task.description && <span>{task.description}</span>}
                    </td>
                    <td className="task-table__date">{formatDueDate(task.dueDateTime)}</td>
                    <td>
                      <label className="govuk-visually-hidden" htmlFor={`status-${task.id}`}>
                        Change status for {task.title}
                      </label>
                      <select
                        className="task-table__status"
                        id={`status-${task.id}`}
                        value={task.status}
                        disabled={busyTaskId === task.id}
                        onChange={event => onStatusChange(task.id, event.target.value as TaskStatus)}
                      >
                        {statuses.map(option => (
                          <option key={option} value={option}>
                            {formatStatus(option)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="task-table__actions">
                      <button
                        className="task-table__action task-table__action--update"
                        type="button"
                        onClick={() => onEdit(task)}
                        disabled={busyTaskId === task.id}
                      >
                        Update
                        <span className="govuk-visually-hidden"> {task.title}</span>
                      </button>
                      <button
                        className="task-table__action task-table__action--delete"
                        type="button"
                        onClick={() => onDelete(task)}
                        disabled={busyTaskId === task.id}
                      >
                        Delete
                        <span className="govuk-visually-hidden"> {task.title}</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {tasks.length === 0 && (
                  <tr>
                    <td className="task-table__empty" colSpan={4}>
                      {search ? 'No tasks match your search.' : 'No tasks yet. Create a task to get started.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}

export default TaskList;
