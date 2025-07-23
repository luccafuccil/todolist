import { TodoList } from "@/components/todo-list-manage";
import { serverCaller } from "@/server/caller";

export default async function Home() {
  const initialTodosResponse = await serverCaller.todo.getAll({ limit: 5 });

  return <TodoList initialTodos={initialTodosResponse.items} />;
}
