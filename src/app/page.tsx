import { TodoList } from "@/components/todo-list-manage";
import { serverCaller } from "@/server/caller";

export default async function Home() {
  const initialTodos = await serverCaller.todo.getAll();

  return <TodoList initialTodos={initialTodos} />;
}
