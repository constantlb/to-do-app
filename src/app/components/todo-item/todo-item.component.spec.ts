import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item.component';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { toggleTaskCompletion, deleteTask, updateTask } from '../../store/task.actions';
import { Task } from '../../models/task.model';
import { AppState } from '../../store/app.store';  // Ensure AppState is imported
import { MockStore, provideMockStore } from '@ngrx/store/testing';  // Use MockStore for testing
import { of } from 'rxjs';  // To simulate observables if needed

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;
  let store: MockStore<AppState>;  // Use MockStore from @ngrx/store/testing
  let dispatchSpy: jest.SpyInstance;  // Jest spy for dispatch
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    isCompleted: false,
    createdAt: Date.now(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,  // Import FormsModule for [(ngModel)]
        TodoItemComponent,  // Import standalone component
      ],
      providers: [
        provideMockStore(), // Provide MockStore
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);  // Inject MockStore
    dispatchSpy = jest.spyOn(store, 'dispatch');  // Spy on the dispatch method

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    component.task = mockTask;  // Set mock task input

    fixture.detectChanges();  // Trigger initial binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize editableTitle with task title', () => {
    expect(component.editableTitle).toBe(mockTask.title);
  });

  it('should display the task title in input field', () => {
    const inputElement = fixture.debugElement.query(By.css('.task-title-input')).nativeElement;
    expect(inputElement.value).toBe(mockTask.title);
  });

  it('should dispatch toggleTaskCompletion action when checkbox is clicked', () => {
    const checkbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
    checkbox.triggerEventHandler('change', null);  // Simulate checkbox click

    expect(dispatchSpy).toHaveBeenCalledWith(toggleTaskCompletion({ id: mockTask.id }));
  });

  it('should dispatch deleteTask action when delete button is clicked', () => {
    const deleteButton = fixture.debugElement.query(By.css('.delete-button'));
    deleteButton.triggerEventHandler('click', null);  // Simulate delete button click

    expect(dispatchSpy).toHaveBeenCalledWith(deleteTask({ id: mockTask.id }));
  });

  it('should dispatch updateTask action when task title is changed', () => {
    component.editableTitle = 'Updated Task Title';
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('.task-title-input')).nativeElement;
    inputElement.value = 'Updated Task Title';
    inputElement.dispatchEvent(new Event('blur'));  // Simulate blur event (when user stops editing)

    expect(dispatchSpy).toHaveBeenCalledWith(updateTask({ task: { ...mockTask, title: 'Updated Task Title' } }));
  });

  it('should save unsaved changes before page unload', () => {
    // Spy on the updateTaskTitle method
    const updateSpy = jest.spyOn(component, 'updateTaskTitle');

    // Change title and simulate page unload
    component.editableTitle = 'Unsaved Task Title';
    window.dispatchEvent(new Event('beforeunload'));

    expect(updateSpy).toHaveBeenCalled();  // Ensure unsaved changes were handled
    expect(dispatchSpy).toHaveBeenCalledWith(updateTask({ task: { ...mockTask, title: 'Unsaved Task Title' } }));
  });
});
