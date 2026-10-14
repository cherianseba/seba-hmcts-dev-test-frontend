import '../scss/main.scss';
import TaskManager from './TaskManager';

import { initAll } from 'govuk-frontend';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

initAll();

const taskManager = document.getElementById('task-manager');

if (taskManager) {
  createRoot(taskManager).render(createElement(TaskManager));
}
