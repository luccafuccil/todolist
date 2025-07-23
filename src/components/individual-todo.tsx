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

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export function IndividualTodo({ todo, onUpdate }: IndividualTodoProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleTodo = trpc.todo.toggle.useMutation({
    onSuccess: onUpdate,
  });

  const deleteTodo = trpc.todo.delete.useMutation({
    onSuccess: () => {
      onUpdate();
      setShowDeleteModal(false);
    },
  });

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = () => {
    deleteTodo.mutate({ id: todo.id });
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
              <span>Created: {formatDate(todo.createdAt)}</span>
              {todo.updatedAt && (
                <span className="ml-2">
                  Last Edit: {formatDate(todo.updatedAt)}
                </span>
              )}
            </div>
          </div>

          <div className="task-actions">
            <button onClick={handleEditClick} className="main-btn text-sm">
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={deleteTodo.isPending}
              className="delete-btn text-sm"
            >
              {deleteTodo.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </li>

      <DeleteModal
        open={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleDeleteCancel}
        title="Are you sure you want to delete this task?"
      />
    </>
  );
}
