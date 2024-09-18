import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTaskComponent } from './add-task.component';
import { FormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { By } from '@angular/platform-browser';
import { Task } from '../../models/task.model';
import { addTask } from '../../store/task.actions';

// Mock uuidv4 to return a fixed value
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, AddTaskComponent], // Import FormsModule and standalone component
      providers: [provideMockStore()], // Provide MockStore for testing
    }).compileComponents();

    store = TestBed.inject(MockStore); // Inject MockStore
    dispatchSpy = jest.spyOn(store, 'dispatch'); // Spy on the dispatch method

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should bind taskTitle to input field', () => {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    // Simulate user typing in the input field
    inputElement.value = 'Test Task';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.taskTitle).toBe('Test Task');
  });

  it('should dispatch addTask action when form is submitted', () => {
    // Set a task title
    component.taskTitle = 'Test Task';
    fixture.detectChanges();

    // Simulate form submission
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null); // Simulate ngSubmit

    // Expected task
    const expectedTask: Task = {
      id: 'test-uuid', // Mocked UUID
      title: 'Test Task',
      isCompleted: false,
      createdAt: (expect as any).any(Number), // Cast `expect` as any to avoid TS error
    };

    // Check if addTask action was dispatched with the correct task
    expect(dispatchSpy).toHaveBeenCalledWith(addTask({ task: expectedTask }));
  });

  it('should clear the input field after adding a task', () => {
    // Set a task title
    component.taskTitle = 'Test Task';
    fixture.detectChanges();

    // Simulate form submission
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null); // Simulate ngSubmit

    // Ensure the input field is cleared after submission
    expect(component.taskTitle).toBe('');
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputElement.value).toBe('');
  });
});
