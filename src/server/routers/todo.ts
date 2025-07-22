import { z } from "zod";
import { router, publicProcedure } from "../trpc";

let nextTodoId = 1;

let todos: Array<{
  id: number;
  text: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
}> = [];

export const todoRouter = router({
  getAll: publicProcedure.query(() => {
    return todos;
  }),

  create: publicProcedure
    .input(
      z.object({
        text: z.string().min(1).max(20),
        description: z.string().optional(),
      })
    )

    .mutation(({ input }) => {
      const newTodo = {
        id: nextTodoId++,
        text: input.text,
        description: input.description,
        completed: false,
        createdAt: new Date(),
      };
      todos.push(newTodo);
      return newTodo;
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

      return todos[todoIndex];
    }),

  toggle: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const todo = todos.find((t) => t.id === input.id);
      if (todo) {
        todo.completed = !todo.completed;
        todo.updatedAt = new Date();
      }
      return todo;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      todos = todos.filter((t) => t.id !== input.id);
      return { success: true };
    }),
});
