import { appRouter } from "./routers/_app";
import { createContext } from "./context";

export const serverCaller = appRouter.createCaller(createContext());
