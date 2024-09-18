import { createReducer, on } from '@ngrx/store';
import * as TA from './task.actions';
import { Task } from '../models/task.model';

export interface TaskState {
  tasks: Task[];
}

export const initialState: TaskState = { tasks: [] };

export const taskReducer = createReducer(
  initialState,
  on(TA.loadTasks, state => ({ ...state })),
  on(TA.loadTasksSuccess, (state, { tasks }) => ({ ...state, tasks })),
  on(TA.loadTasksFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(TA.reorderTasks, (state, { tasks }) => ({ ...state, tasks: [...tasks] })),
  on(TA.addTask, (state, { task }) => ({ ...state, tasks: [...state.tasks, task]})),
  on(TA.updateTask, (state, { task }) => ({ ...state, tasks: state.tasks.map(t => t.id === task.id ? task : t) })),
  on(TA.deleteTask, (state, { id }) => ({ ...state, tasks: state.tasks.filter(t => t.id !== id) })),
  on(TA.toggleTaskCompletion, (state, { id }) => ({
    ...state,
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    )
  })),
  on(TA.deleteExpiredTasks, (state) => {
    const now = new Date().getTime();
    return {
      ...state,
      tasks: state.tasks.filter(task => {
        const taskAge = now - task.createdAt;
        const isExpired = taskAge > 24 * 60 * 60 * 1000;  // 24 hours TTL (adjust as needed)
        return !isExpired;
      })
    };
  })
);
