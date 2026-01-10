import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { TaskFormValues } from "../types/task";

export const TaskDialog = () => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    defaultValues: {
      status: "Todo",
      priority: "Medium",
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    const newTask = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    };

    console.log(newTask);

    reset();
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-primary text-muted px-2 py-1.5 rounded flex items-center gap-2"
      >
        <Plus size={18} />
        Create Task
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/20 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-4 rounded max-w-md w-full"
          >
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-xl font-medium">Add New Task</h2>
                <p className="text-muted-foreground">
                  Please fill in the details below to create a new task.
                </p>
              </div>
              <X className="cursor-pointer" onClick={() => setOpen(false)} />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
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

              {/* Description */}
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

              {/* Status & Priority */}
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
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
