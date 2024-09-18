import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private localStorageKey = 'tasks';

  constructor() { }

  // Load tasks from local storage
  loadTasks(): Observable<Task[]> {
    const tasksJson = localStorage.getItem(this.localStorageKey);
    const tasks = tasksJson ? JSON.parse(tasksJson) : [];
    return of(tasks); // Wrap the array in an Observable
  }

  // Save tasks to local storage
  saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
  }

  // Remove expired tasks (TTL logic)
  deleteExpiredTasks(): void {
    const tasks = this.loadTasksFromLocalStorage();
    const now = new Date().getTime();

    // Filter out tasks that have expired (older than 24 hours)
    const validTasks = tasks.filter(task => {
      const taskAge = now - task.createdAt;
      const isExpired = taskAge > 24 * 60 * 60 * 1000;  // 24 hours TTL

      return !isExpired;
    });

    this.saveTasks(validTasks);  // Save the valid (non-expired) tasks
  }

  // Add task to local storage
  addTask(newTask: Task): void {
    const tasks = this.loadTasksFromLocalStorage();
    tasks.push(newTask);
    localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
  }

  // Update task in local storage
  updateTask(updatedTask: Task): void {
    const tasks = this.loadTasksFromLocalStorage();
    const taskIndex = tasks.findIndex(t => t.id === updatedTask.id);
    if (taskIndex !== -1) {
      tasks[taskIndex] = updatedTask;
      localStorage.setItem(this.localStorageKey, JSON.stringify(tasks));
    }
  }

  // Delete task from local storage
  deleteTask(taskId: string): void {
    const tasks = this.loadTasksFromLocalStorage();
    const updatedTasks = tasks.filter(task => task.id !== taskId); // Remove the task
    localStorage.setItem(this.localStorageKey, JSON.stringify(updatedTasks));
  }

  // Toggle the completion status of a task
  toggleTaskCompletion(taskId: string): void {
    const tasks = this.loadTasksFromLocalStorage();  // Load all tasks
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
      // Toggle the completion status
      tasks[taskIndex].isCompleted = !tasks[taskIndex].isCompleted;

      // Save only the updated task back to local storage
      this.updateTask(tasks[taskIndex]);
    }
  }

  // Helper function to get tasks synchronously from local storage (used internally)
  private loadTasksFromLocalStorage(): Task[] {
    const tasksJson = localStorage.getItem(this.localStorageKey);
    return tasksJson ? JSON.parse(tasksJson) : [];
  }
}
