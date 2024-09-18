import { createAction, props } from '@ngrx/store';
import { Task } from '../models/task.model';

export const loadTasks = createAction('[Task] Load Tasks');
export const loadTasksSuccess = createAction('[Task] Load Tasks Success', props<{ tasks: Task[] }>());
export const loadTasksFailure = createAction('[Task] Load Tasks Failure', props<{ error: string }>());
export const reorderTasks = createAction('[Task] Reorder Tasks', props<{ tasks: Task[] }>());
export const addTask = createAction('[Task] Add Task', props<{ task: Task }>());
export const updateTask = createAction('[Todo] Update Task', props<{ task: Task }>());
export const deleteTask = createAction('[Task] Delete Task', props<{ id: string }>());
export const toggleTaskCompletion = createAction('[Task] Toggle Completion', props<{ id: string }>());
export const deleteExpiredTasks = createAction('[Task] Delete Expired Tasks');
