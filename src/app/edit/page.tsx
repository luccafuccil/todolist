"use client";

import NewTodoForm from "@/components/new-todo-form";
import { trpc } from "@/utils/trpc";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditTodoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const utils = trpc.useUtils();

  const todoId = searchParams.get("id");
  const todoIdNumber = todoId ? parseInt(todoId) : null;

  const {
    data: todo,
    isLoading,
    error,
  } = trpc.todo.getById.useQuery(
    { id: todoIdNumber! },
    { enabled: !!todoIdNumber }
  );

  const editTodo = trpc.todo.edit.useMutation({
    onSuccess: () => {
      try {
        utils.todo.getAll.invalidate();
        router.push("/");
      } catch (error) {
        console.error("Error:", error);
      }
    },
  });

  const handleEditSubmit = (data: { name: string; description: string }) => {
    if (todoIdNumber) {
      editTodo.mutate({
        id: todoIdNumber,
        name: data.name,
        description: data.description,
      });
    }
  };

  if (!todoId || error) {
    return (
      <div className="m-4 bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-red-600">
          {!todoId ? "Error: No task ID provided" : "Error: Task not found"}
        </h1>
        <button
          className="mt-4 text-gray-500 underline hover:text-gray-700"
          onClick={() => router.push("/")}
        >
          ← Back to To-do List
        </button>
      </div>
    );
  }

  return (
    <div className="m-6">
      <button
        className="mb-4 text-gray-500 underline hover:text-gray-700"
        onClick={() => router.push("/")}
      >
        ← Back to To-do List
      </button>
      <h1 className="main-title">Edit Task</h1>

      {isLoading ? (
        <p>Loading task data...</p>
      ) : todo ? (
        <NewTodoForm
          onSubmit={handleEditSubmit}
          initialData={{
            name: todo.name,
            description: todo.description || "",
          }}
          submitText="Update Task"
        />
      ) : null}

      {editTodo.isPending && (
        <p className="text-blue-600 mt-2">Updating task...</p>
      )}

      {editTodo.error && (
        <p className="text-red-600 mt-2">Error: {editTodo.error.message}</p>
      )}
    </div>
  );
}
