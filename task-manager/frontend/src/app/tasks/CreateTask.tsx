"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createTask } from "../api/tasks";

type CreateTaskProps = {
  userId: string;
};

export function CreateTask({ userId }: CreateTaskProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      setError("O conteúdo não pode ficar vazio.");
      return;
    }

    try {
      await createTask(userId, content.trim());
      setContent("");
      setError("");
      router.refresh();
    } catch {
      setError("Não foi possível criar a tarefa.");
    }
  }

  return (
    <form className="mb-6 flex flex-col gap-2" onSubmit={handleSubmit}>
      <label htmlFor="task-content">Nova tarefa</label>
      <textarea
        className="rounded border border-gray-300 px-3 py-2"
        id="task-content"
        onChange={(event) => setContent(event.target.value)}
        placeholder="Digite o conteúdo da tarefa"
        value={content}
      />
      <button
        className="rounded bg-green-600 px-3 py-2 text-white"
        type="submit"
      >
        Criar tarefa
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
