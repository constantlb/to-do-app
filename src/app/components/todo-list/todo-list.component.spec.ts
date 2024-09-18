import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Task } from '../../models/task.model';
import { loadTasks, deleteExpiredTasks, reorderTasks } from '../../store/task.actions';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { of } from 'rxjs';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  const mockTasks: Task[] = [
    { id: '1', title: 'Task 1', isCompleted: false, createdAt: Date.now() },
    { id: '2', title: 'Task 2', isCompleted: true, createdAt: Date.now() },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [provideMockStore({
        initialState: {
          task: {
            tasks: mockTasks
          }
        }
      })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;

    // Mock the window.scrollTo function
    window.scrollTo = jest.fn();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to tasks$ and update local tasks', () => {
    fixture.detectChanges();  // Trigger initial data binding
    expect(component.tasks).toEqual(mockTasks);
  });

  it('should dispatch loadTasks and deleteExpiredTasks on init', () => {
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(loadTasks());
    expect(dispatchSpy).toHaveBeenCalledWith(deleteExpiredTasks());
  });

  it('should dispatch reorderTasks action on drop event', () => {
    fixture.detectChanges();

    const dropEvent: CdkDragDrop<Task[]> = {
      previousIndex: 0,
      currentIndex: 1,
      item: {} as any,
      container: {} as any,
      previousContainer: {} as any,
      isPointerOverContainer: true,
      distance: { x: 0, y: 0 },
      dropPoint: { x: 0, y: 0 },
      event: {} as any
    };

    component.drop(dropEvent);

    const expectedTasks = [...mockTasks];
    [expectedTasks[0], expectedTasks[1]] = [expectedTasks[1], expectedTasks[0]];

    expect(dispatchSpy).toHaveBeenCalledWith(reorderTasks({ tasks: expectedTasks }));
  });

  it('should scroll to the bottom when a new task is added', (done) => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo');
    fixture.detectChanges();

    component.tasks$.subscribe(() => {
      component.tasks.push({
        id: '3',
        title: 'New Task',
        isCompleted: false,
        createdAt: Date.now()
      });

      fixture.detectChanges();

      setTimeout(() => {
        component.scrollToBottom();  // Call scroll to bottom

        expect(scrollToSpy).toHaveBeenCalledWith({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });

        done();  // Indicate that the async test is done
      }, 0);
    });
  });
});
