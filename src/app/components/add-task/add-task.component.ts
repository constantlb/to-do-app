import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addTask } from '../../store/task.actions';
import { FormsModule } from '@angular/forms';
import { AppState } from '../../store/app.store';
import { Task } from '../../models/task.model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  taskTitle: string = '';

  constructor(
    private store: Store<AppState>
  ) {}

  addTask(): void {
    if (this.taskTitle.trim()) {
      const newTask: Task = {
        id: uuidv4(),
        title: this.taskTitle,
        isCompleted: false,
        createdAt: Date.now()
      };

      // Dispatch the addTask action to the store
      this.store.dispatch(addTask({ task: newTask }));

      // Clear the input field after dispatch
      this.taskTitle = '';
    }
  }
}
