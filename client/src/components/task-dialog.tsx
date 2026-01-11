import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Task, TaskFormValues } from "../types/task";
import toast from "react-hot-toast";
import { useTasks } from "../hook/task-context";

type TaskDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialTask?: Task;
  showTrigger?: boolean;
};

export const TaskDialog = ({
  open: openProp,
  onOpenChange,
  initialTask,
  showTrigger = true,
}: TaskDialogProps) => {
  const { addTask, updateTask } = useTasks();
  const isEdit = !!initialTask;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;
  const setOpenSafe = (v: boolean) => {
    if (onOpenChange) onOpenChange(v);
    else setInternalOpen(v);
  };

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    defaultValues: initialTask
      ? {
          title: initialTask.title,
          description: initialTask.description ?? "",
          status: initialTask.status,
          priority: initialTask.priority,
        }
      : {
          status: "Todo",
          priority: "Medium",
        },
  });

  useEffect(() => {
    if (initialTask) {
      reset({
        title: initialTask.title,
        description: initialTask.description ?? "",
        status: initialTask.status,
        priority: initialTask.priority,
      });
    }
  }, [initialTask, reset]);

  const onSubmit = async (data: TaskFormValues) => {
    try {
      setIsLoading(true);

      if (isEdit) {
        await updateTask(initialTask!.id, data);
        toast.success("Task updated successfully");
      } else {
        await addTask(data);
        toast.success("Task created successfully");
      }

      reset();
      setOpenSafe(false);
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? "Failed to update task" : "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showTrigger && (
        <button
          onClick={() => setOpenSafe(true)}
          className="bg-primary text-muted px-2 py-1.5 rounded flex items-center gap-2"
        >
          <Plus size={18} />
          Create Task
        </button>
      )}

      {open && (
        <div
          onClick={() => setOpenSafe(false)}
          className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 sm:p-2 z-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-4 rounded max-w-md w-full"
          >
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-xl font-medium">
                  {isEdit ? "Edit Task" : "Add New Task"}
                </h2>
                <p className="text-muted-foreground">
                  {isEdit
                    ? "Update the fields below to modify this task."
                    : "Please fill in the details below to create a new task."}
                </p>
              </div>
              <X
                className="cursor-pointer"
                onClick={() => setOpenSafe(false)}
              />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1">Title</label>
                <input
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 3,
                      message: "Title must be at least 3 characters",
                    },
                  })}
                  className="w-full border p-2 rounded"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  {...register("description", {
                    maxLength: {
                      value: 200,
                      message: "Description cannot exceed 200 characters",
                    },
                  })}
                  className="w-full border p-2 rounded"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block mb-1">Status</label>
                  <select
                    {...register("status", { required: true })}
                    className="border p-2 rounded w-full"
                  >
                    <option value="Todo">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Completed</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block mb-1">Priority</label>
                  <select
                    {...register("priority", { required: true })}
                    className="border p-2 rounded w-full"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpenSafe(false)}
                  className="cursor-pointer px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin size-4" />
                  ) : null}
                  {isEdit ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
