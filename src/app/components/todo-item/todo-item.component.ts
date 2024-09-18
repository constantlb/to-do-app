import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Store } from '@ngrx/store';
import { toggleTaskCompletion, deleteTask, updateTask } from '../../store/task.actions';
import { Task } from "../../models/task.model";
import { AppState } from '../../store/app.store';


@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css'
})

export class TodoItemComponent implements OnInit, OnDestroy {
  @Input() task!: Task;  // Input property for the task item
  editableTitle: string = '';  // Local property to store the editable title

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.editableTitle = this.task.title;
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  toggleTaskCompletion(): void {
    this.store.dispatch(toggleTaskCompletion({ id: this.task.id }));
  }

  deleteTask(): void {
    this.store.dispatch(deleteTask({id: this.task.id}));
  }

  // Triggered when the user finishes editing the task title (on blur or Enter key)
  updateTaskTitle(): void {
    if (this.editableTitle !== this.task.title) {
      const updatedTask = { ...this.task, title: this.editableTitle };
      this.store.dispatch(updateTask({ task: updatedTask }));
    }
  }

  // Handle unsaved changes before leave page (on reload or close)
  handleBeforeUnload(): void {
    if (this.editableTitle !== this.task.title) {
      this.updateTaskTitle();
    }
  }
}
