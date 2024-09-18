# To-Do List Application

This is a dynamic, reactive To-Do List application built using **Angular 18**, **NgRx** for state management, and **Jest** for testing. The application allows users to add, edit, delete, and mark tasks as completed. The tasks persist in local storage, and features like drag-and-drop reordering and task expiration after 24 hours are also implemented.

## Features

- **Add new tasks**: Users can create new tasks.
- **Edit tasks**: Update the title of existing tasks.
- **Delete tasks**: Remove tasks from the list.
- **Complete tasks**: Mark tasks as completed or uncompleted.
- **Reorder tasks**: Drag-and-drop functionality to reorder tasks.
- **Task expiration**: Tasks older than 24 hours are automatically removed.
- **State management**: Uses **NgRx** to manage the application state.
- **Persistent data**: Tasks are saved in local storage, so they persist between page reloads.
- **Smooth UI/UX**: Modern, responsive design with hover effects and smooth transitions.
- **Testing**: Unit tests written using **Jest** and **Jest-Preset-Angular**.

## Technologies Used

- **Angular 18**: Frontend framework.
- **NgRx**: State management using Redux pattern.
- **RxJS**: Reactive programming with observables.
- **Angular Material**: cdk-drag-drop module.
- **Jest**: Testing framework.
- **Jest-Preset-Angular**: Provides the necessary configurations to test Angular components with Jest.
- **TypeScript**: Strong typing for better code quality and scalability.
- **CSS**: Custom styles for the layout and components.

## Installation and Setup

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18.19.1 or higher)
- **npm**

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/constantlb/to-do-app.git
   cd todo-app
   ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Run the application**:

    ```bash
    npm start
    ```
  This will start the development server at http://localhost:4200/.

### Running Unit tests

To run the tests using Jest, simply run:
  ```bash
  npm test
  ```

### Building the Application

To build the application for production:
  ```bash
  npm run build
  ```
The build files will be created in the dist/ directory.

## Application Structure

Here’s a breakdown of the folder structure for the project:
 ```
src/
│
├── app/
│   ├── components/
│   │   ├── add-task/               # Add Task component
│   │   ├── todo-item/              # Single task item component
│   │   └── todo-list/              # Todo list component (manages task display)
│   ├── models/
│   │   └── task.model.ts           # Task model interface
│   ├── services/
│   │   └── task.service.ts         # Task service for local storage operations
│   ├── store/
│   │   ├── app.store.ts            # NgRx store
│   │   ├── task.actions.ts         # NgRx actions for tasks
│   │   ├── task.effects.ts         # NgRx effects for side effects (loading/saving tasks)
│   │   └── task.reducer.ts         # NgRx reducer for task state
│   ├── app.component.ts            # Root component
│   └── app.config.ts               # Application config
│
├── index.html                      # Main HTML file
├── main.ts                         # Angular Bootstrap Application
└── styles.css                      # Global styles

 ```

## Features Breakdown

### Add and Manage Tasks

- Tasks are managed through the NgRx store, allowing for clear state management and separation of concerns.
- Tasks are saved to localStorage through the TaskService and persist across page reloads.
- The app has a clean UI, where you can create a task using the input field at the bottom of the screen, and tasks will appear in a clean, scrollable list.

### Drag and Drop

- The app uses Angular’s CDK Drag and Drop to reorder tasks by dragging.
- When tasks are reordered, the new order is saved automatically in local storage.

### Task Expiration

- Each task has a 24-hour time-to-live (TTL). After 24 hours, the task is considered expired and is automatically deleted.
- This is handled in the TaskService using the deleteExpiredTasks function, which filters out expired tasks.

### Testing

- Unit tests are written for each component and service using Jest.
- Each feature, such as adding, deleting, updating, and loading tasks, is thoroughly tested.
- The tests mock localStorage to ensure consistent behavior without modifying actual browser data.
