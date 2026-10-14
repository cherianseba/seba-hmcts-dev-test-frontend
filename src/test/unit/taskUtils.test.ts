import { type Task } from '../../main/assets/js/types/task';
import { formatStatus, getTasks } from '../../main/assets/js/utils/taskUtils';

const task: Task = {
  id: 1,
  title: 'Review application',
  status: 'OPEN',
  dueDateTime: '2026-04-30T10:00:00',
};

describe('task utilities', () => {
  describe('formatStatus', () => {
    test.each([
      ['OPEN', 'To do'],
      ['IN_PROGRESS', 'In progress'],
      ['COMPLETED', 'Done'],
    ] as const)('formats %s as %s', (status, label) => {
      expect(formatStatus(status)).toBe(label);
    });
  });

  describe('getTasks', () => {
    test('accepts an array of tasks', () => {
      expect(getTasks([task])).toEqual([task]);
    });

    test('accepts a tasks property containing an array', () => {
      expect(getTasks({ tasks: [task] })).toEqual([task]);
    });

    test('rejects an invalid response', () => {
      expect(() => getTasks({ tasks: 'invalid' })).toThrow('The tasks service returned an invalid response.');
    });
  });
});
