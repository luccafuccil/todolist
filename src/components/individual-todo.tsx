"use client";

import { trpc } from "@/utils/trpc";

interface Todo {
  id: number;
  text: string;
  description?: string;
  completed: boolean;
}

interface IndividualTodoProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onUpdate: () => void;
  isEditDisabled: boolean;
}

export function IndividualTodo({
  todo,
  onEdit,
  onUpdate,
  isEditDisabled,
}: IndividualTodoProps) {
  const toggleTodo = trpc.todo.toggle.useMutation({
    onSuccess: onUpdate,
  });

  const deleteTodo = trpc.todo.delete.useMutation({
    onSuccess: onUpdate,
  });

  return (
    <li className="mb-3 p-3 border rounded-lg">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo.mutate({ id: todo.id })}
          className="mr-3"
        />
        <div className="flex-1">
          <span
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
            }}
            className="font-medium text-xl text-gray-800 block"
          >
            {todo.text}
          </span>
          {todo.description && (
            <span className="text-gray-600 text-sm block mt-1">
              {todo.description}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(todo)}
            className="text-blue-600 hover:text-blue-800 underline text-sm"
            disabled={isEditDisabled}
          >
            Edit
          </button>
          <button
            onClick={() => deleteTodo.mutate({ id: todo.id })}
            disabled={deleteTodo.isPending}
            className="text-red-600 hover:text-red-800 disabled:opacity-50 underline text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}
