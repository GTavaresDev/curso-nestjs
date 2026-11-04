const apiUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
).replace(/\/+$/, "");

export type Task = {
  id: number;
  content: string;
  createdAt: string;
  updateAt: string;
  user: {
    id: number;
    name: string;
  };
};

export async function getTasksByUser(userId: string): Promise<Task[]> {
  const response = await fetch(`${apiUrl}/tasks/user/${userId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const error = new Error(`Erro ao consultar as tarefas: ${response.status}`);
    error.name = response.status === 404 ? "UserNotFoundError" : "ApiError";
    throw error;
  }

  return response.json();
}

export async function updateTask(id: number, content: string) {
  const response = await fetch(`${apiUrl}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao editar a tarefa: ${response.status}`);
  }
}

export async function deleteTask(id: number) {
  const response = await fetch(`${apiUrl}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Erro ao excluir a tarefa: ${response.status}`);
  }
}
