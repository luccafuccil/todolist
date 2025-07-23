"use client";

import { trpc } from "@/utils/trpc";
import { IndividualTodo } from "./individual-todo";
import { useRouter } from "next/navigation";
import { type Todo } from "@/types";
import { DeleteModal } from "./delete-modal";
import { useState } from "react";

interface TodoListProps {
  initialTodos: Todo[];
}

export function TodoList({ initialTodos }: TodoListProps) {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [showClearModal, setShowClearModal] = useState(false);

  const { data: todos, error } = trpc.todo.getAll.useQuery(undefined, {
    initialData: initialTodos,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  const clearCompleted = trpc.todo.clearCompleted.useMutation({
    onSuccess: (result) => {
      console.log(`Deleted ${result.deletedCount} completed tasks`);
      utils.todo.getAll.invalidate();
      setShowClearModal(false);
    },
    onError: (error) => {
      console.error("Failed to clear tasks:", error);
    },
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

  const handleClearCompleted = () => {
    const completedCount = todos?.filter((t) => t.completed).length || 0;

    if (completedCount === 0) {
      console.log("No completed tasks to clear");
      return;
    }

    setShowClearModal(true);
  };

  const handleConfirmClear = () => {
    clearCompleted.mutate();
  };

  const handleCloseModal = () => {
    setShowClearModal(false);
  };

  const completedCount = todos?.filter((t) => t.completed).length || 0;

  return (
    <>
      <div className="m-6">
        <div className="flex gap-10 items-center mb-4">
          <h1 className="main-title">Task List</h1>

          <button
            className="main-btn mb-4"
            onClick={() => router.push("/add-new")}
          >
            Add new task
          </button>
          <button
            className="hover:underline"
            style={{ color: "var(--color-accent-dark)" }}
            onClick={handleClearCompleted}
            disabled={clearCompleted.isPending || completedCount === 0}
          >
            {clearCompleted.isPending ? "Clearing..." : "Clear completed tasks"}
          </button>
        </div>
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

      <DeleteModal
        open={showClearModal}
        onClose={handleConfirmClear}
        onUndo={handleCloseModal}
        title={`Delete ${completedCount} completed task${
          completedCount === 1 ? "" : "s"
        }?`}
      />
    </>
  );
}
