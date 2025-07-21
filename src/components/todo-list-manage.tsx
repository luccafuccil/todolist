"use client";

import { trpc } from "@/utils/trpc";
import { useState } from "react";
import NewTodoForm from "./new-todo-form";
import { IndividualTodo } from "./individual-todo";

export function TodoList() {
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<{
    id: number;
    name: string;
    description: string;
  } | null>(null);

  const utils = trpc.useUtils();
  const { data: todos, isLoading } = trpc.todo.getAll.useQuery();

  const invalidateTodos = () => utils.todo.getAll.invalidate();

  const createTodo = trpc.todo.create.useMutation({
    onSuccess: () => {
      invalidateTodos();
      setShowForm(false);
    },
  });
  const editTodo = trpc.todo.edit.useMutation({
    onSuccess: () => {
      invalidateTodos();
      setEditingTodo(null);
    },
  });

  const handleFormSubmit = (data: { name: string; description: string }) => {
    createTodo.mutate({
      text: data.name,
      description: data.description,
    });
  };

  const handleEditSubmit = (data: { name: string; description: string }) => {
    if (editingTodo) {
      editTodo.mutate({
        id: editingTodo.id,
        text: data.name,
        description: data.description,
      });
    }
  };

  const handleEditClick = (todo: any) => {
    setEditingTodo({
      id: todo.id,
      name: todo.text,
      description: todo.description || "",
    });
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  if (isLoading) {
    return (
      <div className="text-center text-blue-900 font-bold text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="m-4 bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      {!showForm && !editingTodo ? (
        <button className="main-btn mb-4" onClick={() => setShowForm(true)}>
          Add new to-do
        </button>
      ) : showForm && !editingTodo ? (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Add New Todo</h3>
          <NewTodoForm onSubmit={handleFormSubmit} />
          <button
            className="mt-2 text-gray-500 underline"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </div>
      ) : null}

      {editingTodo && (
        <div className="mb-4 border-2 border-blue-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Edit Todo</h3>
          <NewTodoForm
            onSubmit={handleEditSubmit}
            initialData={{
              name: editingTodo.name,
              description: editingTodo.description,
            }}
          />
          <button
            className="mt-2 text-gray-500 underline"
            onClick={handleCancelEdit}
          >
            Cancel Edit
          </button>
        </div>
      )}

      <ul>
        {todos?.map((todo) => (
          <IndividualTodo
            key={todo.id}
            todo={todo}
            onEdit={handleEditClick}
            onUpdate={invalidateTodos}
            isEditDisabled={editingTodo !== null}
          />
        ))}
      </ul>

      {todos?.length === 0 && <p className="text-gray-500">No todos yet.</p>}
    </div>
  );
}
