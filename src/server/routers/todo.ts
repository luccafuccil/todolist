import { z } from "zod";
import { router, publicProcedure } from "../trpc";

type Todo = {
  id: number;
  name: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
};

let nextTodoId = 1;
let todos: Todo[] = [
  {
    id: nextTodoId++,
    name: "Test task 1",
    completed: false,
    description: "This is a test task",
    createdAt: new Date(),
  },
  {
    id: nextTodoId++,
    name: "Test task 2",
    completed: false,
    description: "This is a test task with a description",
    createdAt: new Date(),
  },
  {
    id: nextTodoId++,
    name: "Test task 3",
    completed: false,
    description: "This is another test task",
    createdAt: new Date(),
  },
];

export const todoRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      const todo = todos.find((t) => t.id === input.id);

      if (!todo) {
        throw new Error("Task not found");
      }

      return {
        ...todo,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt?.toISOString(),
      };
    }),

  getAll: publicProcedure
    .input(
      z
        .object({
          cursor: z.number().optional(),
          limit: z.number().min(1).max(50).default(5),
        })
        .optional()
    )
    .query(({ input }) => {
      const { cursor, limit = 5 } = input || {};

      const sortedTodos = [...todos].sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return b.id - a.id;
      });

      let items = sortedTodos;

      if (cursor) {
        const cursorIndex = sortedTodos.findIndex((todo) => todo.id === cursor);
        items = sortedTodos.slice(cursorIndex + 1);
      }

      const paginatedItems = items.slice(0, limit);

      const nextCursor =
        paginatedItems.length === limit
          ? paginatedItems[paginatedItems.length - 1].id
          : undefined;

      return {
        items: paginatedItems.map((todo) => ({
          ...todo,
          createdAt: todo.createdAt.toISOString(),
          updatedAt: todo.updatedAt?.toISOString(),
        })),
        nextCursor,
        hasMore: !!nextCursor,
      };
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, "Name is required")
          .max(50, "Name cannot be longer than 50 characters"),
        description: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const existingTodo = todos.find(
        (t) => t.name.toLowerCase().trim() === input.name.toLowerCase().trim()
      );
      if (existingTodo) {
        throw new Error("You cannot have two tasks with the same name");
      }

      if (todos.length >= 1000) {
        throw new Error("Maximum number of tasks reached");
      }

      if (input.name.trim() !== input.name) {
        throw new Error("Task name cannot start or end with spaces");
      }

      const newTodo: Todo = {
        id: nextTodoId++,
        name: input.name,
        description: input.description,
        completed: false,
        createdAt: new Date(),
      };
      todos.push(newTodo);

      return {
        ...newTodo,
        createdAt: newTodo.createdAt.toISOString(),
      };
    }),

  edit: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const todoIndex = todos.findIndex((t) => t.id === input.id);

      if (todoIndex === -1) {
        throw new Error("Task could not be found");
      }
      const todo = todos[todoIndex];
      if (input.name && input.name !== todo.name) {
        const duplicate = todos.find(
          (t) =>
            t.id !== input.id &&
            input.name &&
            t.name.toLowerCase() === input.name.toLowerCase()
        );
        if (duplicate) {
          throw new Error("You cannot have two tasks with the same name");
        }
      }

      if (input.name !== undefined) {
        todos[todoIndex].name = input.name;
      }
      if (input.description !== undefined) {
        todos[todoIndex].description = input.description;
      }
      todos[todoIndex].updatedAt = new Date();

      return {
        ...todos[todoIndex],
        createdAt: todos[todoIndex].createdAt.toISOString(),
        updatedAt: todos[todoIndex].updatedAt?.toISOString(),
      };
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const todoIndex = todos.findIndex((t) => t.id === input.id);

      if (todoIndex === -1) {
        throw new Error("Task not found");
      }

      const todo = todos[todoIndex];
      todo.completed = !todo.completed;

      return {
        todo,
      };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const todoExists = todos.find((t) => t.id === input.id);
      if (!todoExists) {
        throw new Error("Task not found or already deleted");
      }

      const initialLength = todos.length;
      todos = todos.filter((t) => t.id !== input.id);

      return { success: todos.length < initialLength };
    }),

  clearCompleted: publicProcedure.mutation(() => {
    const initialLength = todos.length;
    const completedCount = todos.filter((t) => t.completed).length;

    todos = todos.filter((t) => !t.completed);

    return {
      success: true,
      deletedCount: completedCount,
      remainingCount: todos.length,
    };
  }),
});
