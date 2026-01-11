import { Loader2 } from "lucide-react";
import React from "react";

type AlertTaskDeletionProps = {
  open: boolean;
  taskTitle?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const AlertTaskDeletion: React.FC<AlertTaskDeletionProps> = ({
  open,
  taskTitle,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card shadow-lg p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2
            id="delete-task-title"
            className="text-lg font-medium text-card-foreground"
          >
            Delete task?
          </h2>
        </div>

        <div className="mb-4 text-sm text-muted-foreground">
          {taskTitle ? (
            <p>
              This will permanently delete “{taskTitle}”. This action cannot be
              undone.
            </p>
          ) : (
            <p>
              This will permanently delete the selected task. This action cannot
              be undone.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="cursor-pointer rounded-md border border-border px-3 py-2 text-foreground transition-colors hover:bg-muted"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="flex items-center gap-2 cursor-pointer rounded-md bg-destructive px-3 py-2 text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin size-4" /> : null}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
