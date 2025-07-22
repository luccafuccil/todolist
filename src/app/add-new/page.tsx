"use client";

import NewTodoForm from "@/components/new-todo-form";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";

export default function AddNewPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const createTodo = trpc.todo.create.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate();
      router.push("/");
    },
  });

  const handleFormSubmit = (data: { name: string; description: string }) => {
    createTodo.mutate({
      text: data.name,
      description: data.description,
    });
  };

  return (
    <div className="m-4 bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add New To-do</h1>

      <NewTodoForm onSubmit={handleFormSubmit} />

      <button
        className="mt-4 text-gray-500 underline hover:text-gray-700"
        onClick={() => router.push("/")}
      >
        ← Back to To-do List
      </button>

      {createTodo.isPending && (
        <p className="text-blue-600 mt-2">Creating task...</p>
      )}

      {createTodo.error && (
        <p className="text-red-600 mt-2">Error: {createTodo.error.message}</p>
      )}
    </div>
  );
}
