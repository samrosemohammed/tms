import { createContext, useContext } from "react";
import type { Task, TaskFormValues } from "../types/task";

export type TaskContextType = {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => void;
  addTask: (task: TaskFormValues) => Promise<void>;
  updateTask: (id: string, task: TaskFormValues) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
};

export const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
