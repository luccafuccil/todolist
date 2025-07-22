import { type AppRouter } from "@/server/routers/_app";
import { type inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type Todo = RouterOutputs["todo"]["getAll"][0];

export type CreateTodoInput = {
  text: string;
  description?: string;
};

export type EditTodoInput = {
  id: number;
  text?: string;
  description?: string;
};
