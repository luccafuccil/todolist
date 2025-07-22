"use client";

import { trpc } from "@/utils/trpc";
import { IndividualTodo } from "./individual-todo";
import { useRouter } from "next/navigation";

export function TodoList() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: todos, isLoading } = trpc.todo.getAll.useQuery();

  const invalidateTodos = () => utils.todo.getAll.invalidate();

  if (isLoading) {
    return (
      <div className="text-center text-blue-900 font-bold text-2xl">
        Loading...
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
        {todos?.map((todo) => (
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
