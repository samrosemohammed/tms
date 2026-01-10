import { TaskDialog } from "./components/task-dialog";

function App() {
  return (
    <>
      <div className="container mx-auto max-w-screen-7xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="font-medium text-2xl">Task Manager</h1>
            <p className="text-muted-foreground">
              Welcome to the Task Manager Application!
            </p>
          </div>
          <TaskDialog />
        </div>
      </div>
    </>
  );
}

export default App;
