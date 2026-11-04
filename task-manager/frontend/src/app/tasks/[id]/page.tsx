import { Suspense } from "react";
import { getTasksByUser } from "../../api/tasks";
import { CreateTask } from "../CreateTask";
import { TaskActions } from "../TaskActions";

type TaskDetailsProps = {
  params: Promise<{ id: string }>;
};

export default function TaskPage({ params }: TaskDetailsProps) {
  return (
    <Suspense fallback={<p>Carregando tarefa...</p>}>
      <TaskDetails params={params} />
    </Suspense>
  );
}

async function TaskDetails({ params }: TaskDetailsProps) {
  const { id: userId } = await params;
  const result = await loadTasks(userId);

  if (result.error === "UserNotFoundError") {
    return <p>Usuário {userId} não encontrado.</p>;
  }

  if (result.error) {
    return <p>Não foi possível carregar as tarefas.</p>;
  }

  const { tasks } = result;

  return (
    <main className="flex min-h-screen justify-center px-4 py-10">
      <div className="w-full max-w-2xl text-center">
        <h1>Tarefas do usuário {userId}</h1>
        <CreateTask userId={userId} />
        {tasks.length === 0 ? (
          <p>Nenhuma tarefa encontrada para o usuário {userId}.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {tasks.map((task) => (
              <article
                className="rounded border border-gray-200 p-6 shadow"
                key={task.id}
              >
                <h2>Tarefa {task.id}</h2>
                <p>{task.content}</p>
                <p>Usuário: {task.user.name}</p>
                <TaskActions content={task.content} id={task.id} />
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

async function loadTasks(userId: string) {
  try {
    return { tasks: await getTasksByUser(userId), error: null };
  } catch (error) {
    return {
      tasks: [],
      error: error instanceof Error ? error.name : "ApiError",
    };
  }
}
