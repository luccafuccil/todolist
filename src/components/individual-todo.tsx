"use client";

import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { type Todo } from "@/types";
import { useState } from "react";
import { DeleteModal } from "./delete-modal";

interface IndividualTodoProps {
  todo: Todo;
  onUpdate: () => void;
}

export function IndividualTodo({ todo, onUpdate }: IndividualTodoProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletedTodo, setDeletedTodo] = useState<Todo | null>(null);

  const toggleTodo = trpc.todo.toggle.useMutation({
    onSuccess: onUpdate,
  });

  const deleteTodo = trpc.todo.delete.useMutation({
    onSuccess: () => {
      setDeletedTodo(todo);
      setShowDeleteModal(true);
    },
  });

  const createTodo = trpc.todo.create.useMutation({
    onSuccess: onUpdate,
  });

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setDeletedTodo(null);
    onUpdate();
  };

  const handleUndoDelete = async () => {
    try {
      if (deletedTodo) {
        await createTodo.mutateAsync({
          name: deletedTodo.name,
          description: deletedTodo.description || undefined,
        });
        setShowDeleteModal(false);
        setDeletedTodo(null);
      }
    } catch (error) {
      console.error("Cannot undo delete:", error);
      setShowDeleteModal(true);
    }
  };

  const handleEditClick = () => {
    router.push(`/edit?id=${todo.id}`);
  };

  return (
    <>
      <li className="mb-3 p-3 shadow-md rounded-lg h-fit bg-white">
        <div className="flex items-center h-full">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo.mutate({ id: todo.id })}
            className="mr-3 cursor-pointer"
          />
          <div className="flex flex-col justify-evenly flex-1 h-full ml-2">
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "#9ca3af" : "#1f2937",
              }}
              className="font-medium text-xl text-gray-800 block"
            >
              {todo.name}
            </span>

            {todo.description && (
              <span className="text-gray-600 text-sm block mt-1">
                {todo.description}
              </span>
            )}

            <div className="text-gray-500 text-xs mt-1">
              <span>
                {new Intl.DateTimeFormat("en", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(todo.createdAt))}
              </span>
              {todo.updatedAt && (
                <span className="ml-2">
                  Last Edit:{" "}
                  {new Intl.DateTimeFormat("en", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(todo.updatedAt))}
                </span>
              )}
            </div>
          </div>

          <div className="task-actions">
            <button onClick={handleEditClick} className="main-btn text-sm">
              Edit
            </button>
            <button
              onClick={() => deleteTodo.mutate({ id: todo.id })}
              disabled={deleteTodo.isPending}
              className="delete-btn text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </li>
      <DeleteModal
        open={showDeleteModal}
        onClose={handleDeleteModalClose}
        onUndo={handleUndoDelete}
        title="Task will be deleted."
      />
    </>
  );
}
