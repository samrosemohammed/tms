import { useMemo, useState } from "react";
import { Pencil, Trash2, Clock, Loader2, Search, Inbox } from "lucide-react";
import { format } from "date-fns";
import { getPriorityColor, getStatusColor, type Task } from "../types/task";
import { cn } from "../lib/utils";
import { AlertTaskDeletion } from "./alert-task-deletion";
import toast from "react-hot-toast";
import { TaskDialog } from "./task-dialog";
import { useTasks } from "../hook/task-context";

export const TaskList = () => {
  const { tasks, loading, deleteTask } = useTasks();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Todo" | "In Progress" | "Done"
  >("All");
  const [priorityFilter, setPriorityFilter] = useState<
    "All" | "Low" | "Medium" | "High"
  >("All");

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      const matchesPriority =
        priorityFilter === "All" || t.priority === priorityFilter;
      const matchesSearch =
        q === "" ||
        t.title.toLowerCase().includes(q) ||
        (t.description?.toLowerCase().includes(q) ?? false);
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, statusFilter, priorityFilter, search]);
  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredTasks.slice(start, end);
  }, [filteredTasks, currentPage]);

  const formatDate = (dateString: string) =>
    format(new Date(dateString), "PP p");

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

    try {
      await deleteTask(taskToDelete.id);
      toast.success("Task deleted successfully");
      closeDeleteConfirm();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setEditOpen(true);
  };

  return (
    <>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative w-full sm:flex-1 sm:max-w-md">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or description..."
            className="w-full border px-2 py-1.5 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as typeof statusFilter)
          }
          className="w-full sm:w-auto border p-2 rounded"
        >
          <option value="All">All Statuses</option>
          <option value="Todo">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value as typeof priorityFilter)
          }
          className="w-full sm:w-auto border p-2 rounded"
        >
          <option value="All">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {loading ? (
        <div className="h-[60vh] flex items-center justify-center mt-6 p-6 rounded-lg border border-dashed">
          <Loader2 className="mr-2 size-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading tasks…</span>
        </div>
      ) : paginatedTasks.length === 0 ? (
        <div className="h-[60vh] mt-6 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center">
          <Inbox className="h-7 w-7 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No tasks match your filters.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <div className="grid gap-4">
            {paginatedTasks.map((task) => (
              <div
                key={task.id}
                className="group rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-lg text-card-foreground break-words">
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
                      <p className="text-sm text-muted-foreground break-words">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Created: {formatDate(task.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                    <button
                      type="button"
                      className="rounded-md p-2 text-primary hover:bg-primary/10"
                      onClick={() => openEdit(task)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-md p-2 text-destructive hover:bg-destructive/10"
                      onClick={() => openDeleteConfirm(task)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="cursor-pointer rounded border px-3 py-1 text-sm disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "cursor-pointer rounded border px-3 py-1 text-sm",
                        page === currentPage
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="cursor-pointer rounded border px-3 py-1 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <TaskDialog
        showTrigger={false}
        open={editOpen}
        initialTask={editingTask ?? undefined}
        onOpenChange={(o) => {
          setEditOpen(o);
          if (!o) setEditingTask(null);
        }}
      />
      <AlertTaskDeletion
        open={confirmOpen}
        taskTitle={taskToDelete?.title}
        loading={loading}
        onCancel={closeDeleteConfirm}
        onConfirm={handleDelete}
      />
    </>
  );
};
