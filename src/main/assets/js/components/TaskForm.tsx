import { type TaskFormValues, type TaskStatus } from '../types/task';
import { formatStatus } from '../utils/taskUtils';

import { type FormEvent, type ReactElement } from 'react';

interface TaskFormProps {
  isOpen: boolean;
  isEditing: boolean;
  isSaving: boolean;
  error: string;
  form: TaskFormValues;
  onChange: (updates: Partial<TaskFormValues>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

const statuses: TaskStatus[] = ['OPEN', 'IN_PROGRESS', 'COMPLETED'];

function TaskForm({
  isOpen,
  isEditing,
  isSaving,
  error,
  form,
  onChange,
  onSubmit,
  onClose,
}: TaskFormProps): ReactElement | null {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="task-dialog-backdrop"
      role="presentation"
      onMouseDown={event => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section className="task-dialog" role="dialog" aria-modal="true" aria-labelledby="task-dialog-title">
        <div className="task-dialog__header">
          <h2 id="task-dialog-title" className="govuk-heading-m">
            {isEditing ? 'Edit task' : 'Create task'}
          </h2>
          <button className="task-dialog__close" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="task-title">
              Task title
            </label>
            <input
              autoFocus
              className="govuk-input"
              id="task-title"
              value={form.title}
              onChange={event => onChange({ title: event.target.value })}
              maxLength={160}
              required
            />
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="task-description">
              Description <span className="govuk-hint govuk-!-display-inline">(optional)</span>
            </label>
            <textarea
              className="govuk-textarea"
              id="task-description"
              rows={4}
              maxLength={4000}
              value={form.description}
              onChange={event => onChange({ description: event.target.value })}
            />
          </div>
          <div className="task-dialog__fields">
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="task-status">
                Status
              </label>
              <select
                className="govuk-select"
                id="task-status"
                value={form.status}
                onChange={event => onChange({ status: event.target.value as TaskStatus })}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="task-due-date">
                Due date and time
              </label>
              <input
                className="govuk-input"
                id="task-due-date"
                type="datetime-local"
                value={form.dueDate}
                onChange={event => onChange({ dueDate: event.target.value })}
                required
              />
            </div>
          </div>
          {error && (
            <p className="govuk-error-message" role="alert">
              {error}
            </p>
          )}
          <div className="task-dialog__actions">
            <button className="govuk-button" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving…' : isEditing ? 'Save changes' : 'Create task'}
            </button>
            <button
              className="govuk-button govuk-button--secondary"
              type="button"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default TaskForm;
