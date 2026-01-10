export type Status = "Todo" | "In Progress" | "Done";
export type Priority = "Low" | "Medium" | "High";

export type TaskFormValues = {
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
};

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  createdAt: string;
}
