import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TaskService } from '../services/task.service';
import * as TaskActions from './task.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class TaskEffects {
  private taskService = inject(TaskService);

  loadTasks$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(TaskActions.loadTasks),
      mergeMap(() =>
        this.taskService.loadTasks().pipe(
          map((tasks) => TaskActions.loadTasksSuccess({ tasks })),
          catchError((error) =>
            of(TaskActions.loadTasksFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addTask$ = createEffect(() => inject(Actions).pipe(
    ofType(TaskActions.addTask),
    tap(({ task }) => {
      console.log('[EFFECT] Adding task:', task);
      this.taskService.addTask(task); // Add the task via service
    })
  ), { dispatch: false });

  updateTask$ = createEffect(() => inject(Actions).pipe(
    ofType(TaskActions.updateTask),
    tap(({ task }) => {
      console.log('[EFFECT] Updating task:', task);
      this.taskService.updateTask(task); // Update the task via service
    })
  ), { dispatch: false });

  reorderTasks$ = createEffect(() => inject(Actions).pipe(
    ofType(TaskActions.reorderTasks),
    tap(({ tasks }) => {
      console.log('[EFFECT] Reorders tasks:', tasks);
      this.taskService.saveTasks(tasks);
    })
  ), { dispatch: false });

  deleteTask$ = createEffect(() => inject(Actions).pipe(
    ofType(TaskActions.deleteTask),
    tap(({ id }) => {
      console.log('[EFFECT] Deleting task:', id);
      this.taskService.deleteTask(id); // Delete the task via service
    })
  ), { dispatch: false });

  toggleTaskCompletion$ = createEffect(() => inject(Actions).pipe(
    ofType(TaskActions.toggleTaskCompletion),
    tap(({ id }) => {
      this.taskService.toggleTaskCompletion(id);  // Toggle task completion via service
    })
  ), { dispatch: false }
  );

  deleteExpiredTasks$ = createEffect(() => inject(Actions).pipe(
        ofType(TaskActions.deleteExpiredTasks),
        tap(() => {
          this.taskService.deleteExpiredTasks();
        })
      ),
    { dispatch: false }
  );
}
