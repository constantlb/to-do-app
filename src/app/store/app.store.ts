import { taskReducer, TaskState } from "./task.reducer";
import { ActionReducerMap } from "@ngrx/store";

export interface AppState {
  task: TaskState;
}

export const appReducers: ActionReducerMap<AppState> = {
  task: taskReducer
};
