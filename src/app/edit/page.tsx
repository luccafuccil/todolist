"use client";

import NewTodoForm from "@/components/new-todo-form";
import { trpc } from "@/utils/trpc";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditTodoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const utils = trpc.useUtils();

  const todoId = searchParams.get("id");
  const [initialData, setInitialData] = useState<
    | {
        name: string;
        description: string;
      }
    | undefined
  >(undefined);

  const { data: todos } = trpc.todo.getAll.useQuery();

  const editTodo = trpc.todo.edit.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate();
      router.push("/");
    },
  });

  useEffect(() => {
    if (todos && todoId) {
      const todo = todos.find((t) => t.id === parseInt(todoId));
      if (todo) {
        setInitialData({
          name: todo.text,
          description: todo.description || "",
        });
      }
    }
  }, [todos, todoId]);

  const handleEditSubmit = (data: { name: string; description: string }) => {
    if (todoId) {
      editTodo.mutate({
        id: parseInt(todoId),
        text: data.name,
        description: data.description,
      });
    }
  };

  if (!todoId) {
    return (
      <div className="m-4 bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-red-600">Error: No task ID provided</h1>
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
    <div className="m-4 bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Edit Todo</h1>

      {initialData ? (
        <NewTodoForm onSubmit={handleEditSubmit} initialData={initialData} />
      ) : (
        <p>Loading task data...</p>
      )}

      <button
        className="mt-4 text-gray-500 underline hover:text-gray-700"
        onClick={() => router.push("/")}
      >
        ← Back to To-do List
      </button>

      {editTodo.isPending && (
        <p className="text-blue-600 mt-2">Updating task...</p>
      )}

      {editTodo.error && (
        <p className="text-red-600 mt-2">Error: {editTodo.error.message}</p>
      )}
    </div>
  );
}
