import { type AppRouter } from "@/server/routers/_app";
import { type inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type Todo = RouterOutputs["todo"]["getAll"]["items"][0];
