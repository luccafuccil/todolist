import { z } from "zod";
import { router, publicProcedure } from "../trpc";

type Todo = {
  id: number;
  text: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
};

let nextTodoId = 1;
let todos: Todo[] = [
  {
    id: nextTodoId++,
    text: "Test task 1",
    completed: false,
    description: "This is a test task",
    createdAt: new Date(),
  },
  {
    id: nextTodoId++,
    text: "Test task 2",
    completed: false,
    description: "This is a test task with a description",
    createdAt: new Date(),
  },
  {
    id: nextTodoId++,
    text: "Test task 3",
    completed: false,
    description: "This is another test task",
    createdAt: new Date(),
  },
];

export const todoRouter = router({
  getAll: publicProcedure.query(() => {
    return todos.map((todo) => ({
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt?.toISOString(),
    }));
  }),

  create: publicProcedure
    .input(
      z.object({
        text: z.string().min(1).max(20),
        description: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const newTodo: Todo = {
        id: nextTodoId++,
        text: input.text,
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
        text: z.string().min(1).optional(),
        description: z.string().optional(),
      })
    )
    .mutation(({ input }) => {
      const todoIndex = todos.findIndex((t) => t.id === input.id);
      if (todoIndex === -1) {
        throw new Error("To-do not found");
      }

      if (input.text !== undefined) {
        todos[todoIndex].text = input.text;
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
      const todo = todos.find((t) => t.id === input.id);
      if (todo) {
        todo.completed = !todo.completed;
        todo.updatedAt = new Date();

        return {
          ...todo,
          createdAt: todo.createdAt.toISOString(),
          updatedAt: todo.updatedAt?.toISOString(),
        };
      }
      return null;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const initialLength = todos.length;
      todos = todos.filter((t) => t.id !== input.id);
      return { success: todos.length < initialLength };
    }),
});
