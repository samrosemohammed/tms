import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { Task } from "../types/task";
import { cn } from "../lib/utils";
import { AlertTaskDeletion } from "./alert-task-deletion";
import toast from "react-hot-toast";

export const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    fetch("http://localhost:3000/tasks")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }
        return res.json();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "PP p");

  const getStatusColor = (status: string) => {
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

  const getPriorityColor = (priority: string) => {
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
  const openDeleteConfirm = (task: Task) => {
    setTaskToDelete(task);
    setConfirmOpen(true);
  };
  const closeDeleteConfirm = () => {
    setConfirmOpen(false);
    setTaskToDelete(null);
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `http://localhost:3000/tasks/${taskToDelete.id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      toast.success("Task deleted successfully");
      closeDeleteConfirm();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };
  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center p-8">
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="animate-spin size-4" /> Loading tasks...
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="mt-6 rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          No tasks yet. Create your first task to get started!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6">
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="group rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-lg text-card-foreground">
                      {task.title}
                    </h3>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        getStatusColor(task.status)
                      )}
                    >
                      {task.status}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        getPriorityColor(task.priority)
                      )}
                    >
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Created: {formatDate(task.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    className="rounded-md p-2 text-primary transition-colors hover:bg-primary/10"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-2 text-destructive transition-colors hover:bg-destructive/10"
                    onClick={() => openDeleteConfirm(task)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AlertTaskDeletion
        open={confirmOpen}
        taskTitle={taskToDelete?.title}
        loading={deleting}
        onCancel={closeDeleteConfirm}
        onConfirm={handleDelete}
      />
    </>
  );
};
