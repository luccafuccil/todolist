"use client";

import { trpc } from "@/utils/trpc";
import { IndividualTodo } from "./individual-todo";
import { useRouter } from "next/navigation";
import { type Todo } from "@/types";

interface TodoListProps {
  initialTodos: Todo[];
}

export function TodoList({ initialTodos }: TodoListProps) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: todos, error } = trpc.todo.getAll.useQuery(undefined, {
    initialData: initialTodos,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  const invalidateTodos = async () => {
    try {
      await utils.todo.getAll.invalidate();
    } catch (error: any) {
      console.error("Failed to refresh tasks:", error);
    }
  };

  if (error) {
    console.error("Failed to load tasks:", error);
    return (
      <div className="m-4 bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-red-600">Error loading tasks!</h1>
        <p className="text-gray-600">{error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="m-4 bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">To-do List</h1>

      <button className="main-btn mb-4" onClick={() => router.push("/add-new")}>
        Add new task
      </button>
      <ul>
        {[...(todos ?? [])].reverse().map((todo) => (
          <IndividualTodo
            key={todo.id}
            todo={todo}
            onUpdate={invalidateTodos}
          />
        ))}
      </ul>

      {todos?.length === 0 && <p className="text-gray-500">No tasks yet.</p>}
    </div>
  );
}
