"use client";

import NewTodoForm from "@/components/new-todo-form";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";

export default function AddNewPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const createTodo = trpc.todo.create.useMutation({
    onSuccess: () => {
      try {
        utils.todo.getAll.invalidate();
        router.push("/");
      } catch (error) {
        console.error("Error:", error);
      }
    },
    onError: (error) => {
      console.error("Task creation failed:", error.message);
    },
  });

  const handleFormSubmit = (data: { name: string; description: string }) => {
    createTodo.mutate({
      name: data.name,
      description: data.description,
    });
  };

  return (
    <div className="m-6">
      <button
        className="mb-4 text-gray-500 underline hover:text-gray-700"
        onClick={() => router.push("/")}
      >
        ← Back to To-do List
      </button>
      <h1 className="main-title">Add New Task</h1>

      <NewTodoForm onSubmit={handleFormSubmit} />

      {createTodo.isPending && (
        <p className="text-gray-600 mt-4">Creating task...</p>
      )}

      {createTodo.error && (
        <p className="text-red-600 mt-2">Error: {createTodo.error.message}</p>
      )}
    </div>
  );
}
