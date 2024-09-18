import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    isCompleted: false,
    createdAt: Date.now()
  };

  const mockTaskList: Task[] = [
    mockTask,
    {
      id: '2',
      title: 'Another Task',
      isCompleted: true,
      createdAt: Date.now() - 25 * 60 * 60 * 1000, // More than 24 hours old (expired)
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService]
    });

    service = TestBed.inject(TaskService);

    // Mock localStorage
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.setItem = jest.fn();
  });

  it('should load tasks from localStorage', () => {
    jest.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockTaskList));

    service.loadTasks().subscribe(tasks => {
      expect(tasks).toEqual(mockTaskList);
    });

    expect(localStorage.getItem).toHaveBeenCalledWith('tasks');
  });

  it('should save tasks to localStorage', () => {
    service.saveTasks(mockTaskList);

    expect(localStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(mockTaskList));
  });

  it('should add a new task to localStorage', () => {
    jest.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockTaskList));

    const newTask: Task = {
      id: '3',
      title: 'New Task',
      isCompleted: false,
      createdAt: Date.now()
    };

    service.addTask(newTask);

    const updatedTaskList = [...mockTaskList, newTask];

    expect(localStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(updatedTaskList));
  });

  it('should update an existing task in localStorage', () => {
    jest.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockTaskList));

    const updatedTask: Task = { ...mockTask, title: 'Updated Task' };

    service.updateTask(updatedTask);

    const updatedTaskList = [updatedTask, mockTaskList[1]];

    expect(localStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(updatedTaskList));
  });

  it('should delete a task from localStorage', () => {
    jest.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockTaskList));

    service.deleteTask('1');

    const updatedTaskList = [mockTaskList[1]]; // Only the second task remains

    expect(localStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(updatedTaskList));
  });

  it('should toggle task completion status', () => {
    jest.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockTaskList));

    service.toggleTaskCompletion('1');

    const updatedTask = { ...mockTask, isCompleted: true };
    const updatedTaskList = [updatedTask, mockTaskList[1]];

    expect(localStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(updatedTaskList));
  });

  it('should delete expired tasks from localStorage', () => {
    jest.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify(mockTaskList));

    service.deleteExpiredTasks();

    const validTasks = [mockTask]; // Only the first task is valid, second one is expired

    expect(localStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(validTasks));
  });
});
