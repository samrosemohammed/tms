import { Toaster } from "react-hot-toast";
import { TaskDialog } from "./components/task-dialog";
import { TaskList } from "./components/task-list";
import { TaskProvider } from "./context/task-context";

function App() {
  return (
    <>
      <TaskProvider>
        <Toaster position="top-center" />
        <div className="container mx-auto max-w-screen-7xl p-4 min-h-screen">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h1 className="font-medium text-2xl">Task Manager</h1>
              <p className="text-muted-foreground">
                Welcome to the Task Manager Application!
              </p>
            </div>
            <TaskDialog />
          </div>
          <TaskList />
        </div>
      </TaskProvider>
    </>
  );
}

export default App;
