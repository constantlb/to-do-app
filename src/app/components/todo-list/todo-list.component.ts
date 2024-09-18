import {ChangeDetectorRef, Component, OnInit, } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import * as TaskActions from '../../store/task.actions';
import { AppState } from '../../store/app.store';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { TodoItemComponent } from "../todo-item/todo-item.component";
import { AddTaskComponent } from "../add-task/add-task.component";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    TodoItemComponent,
    CdkDrag,
    CdkDropList,
    AddTaskComponent,
    AsyncPipe
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})

export class TodoListComponent implements OnInit {
  tasks$: Observable<Task[]>;  // Observable for task list
  tasks: Task[] = [];  // Local variable to store tasks after subscription
  private previousTasksLength = 0;

  constructor(private store: Store<AppState>, private cdr: ChangeDetectorRef) {
    this.tasks$ = this.store.select((state) => state.task.tasks);
  }

  ngOnInit(): void {
    // Subscribe to the observable and store tasks in the local variable
    this.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      if (tasks.length > this.previousTasksLength) {
        this.scrollToBottom();  // Only scroll down if a new task has been added
      }

      this.previousTasksLength = tasks.length;
    });
    // Dispatch action to load tasks from localStorage when the component initializes
    this.store.dispatch(TaskActions.loadTasks());
    this.store.dispatch(TaskActions.deleteExpiredTasks());
  }

  // Handle the drag and drop action to reorder tasks
  drop(event: CdkDragDrop<Task[]>): void {
    if (!this.tasks) {
      return;
    }

    const updatedTasks = [...this.tasks];  // Create a copy of the task list
    moveItemInArray(updatedTasks, event.previousIndex, event.currentIndex);  // Reorder tasks
    // Dispatch action to update the store with reordered tasks
    this.store.dispatch(TaskActions.reorderTasks({ tasks: updatedTasks }));
  }

  // Scroll to the bottom of the entire page
  scrollToBottom(): void {
    this.cdr.detectChanges();  // Ensure the DOM has been updated
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 0);  // Ensure this happens after Angular updates the DOM
  }
}
