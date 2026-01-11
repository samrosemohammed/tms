export type Status = "Todo" | "In Progress" | "Done";
export type Priority = "Low" | "Medium" | "High";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Todo":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "In Progress":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "Done":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "Medium":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    case "Low":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};
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
