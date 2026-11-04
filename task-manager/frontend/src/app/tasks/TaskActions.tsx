"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTask, updateTask } from "../api/tasks";

type TaskActionsProps = {
  id: number;
  content: string;
};

export function TaskActions({ id, content }: TaskActionsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [error, setError] = useState("");

  async function handleEdit() {
    if (!editedContent.trim()) {
      setError("O conteúdo não pode ficar vazio.");
      return;
    }

    try {
      await updateTask(id, editedContent.trim());
      setIsEditing(false);
      setError("");
      router.refresh();
    } catch {
      setError("Não foi possível editar a tarefa.");
    }
  }

  async function handleDelete() {
    try {
      await deleteTask(id);
      router.refresh();
    } catch {
      setError("Não foi possível excluir a tarefa.");
    }
  }

  if (isEditing) {
    return (
      <div className="mt-4 flex flex-col gap-2">
        <input
          className="rounded border border-gray-300 px-3 py-2"
          value={editedContent}
          onChange={(event) => setEditedContent(event.target.value)}
        />
        <div className="flex justify-center gap-2">
          <button
            className="rounded bg-green-600 px-3 py-2 text-white"
            onClick={handleEdit}
            type="button"
          >
            Salvar
          </button>
          <button
            className="rounded bg-gray-500 px-3 py-2 text-white"
            onClick={() => setIsEditing(false)}
            type="button"
          >
            Cancelar
          </button>
        </div>
        {error && <p className="text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col items-center gap-2">
      <div className="flex gap-2">
        <button
          className="rounded bg-blue-600 px-3 py-2 text-white"
          onClick={() => setIsEditing(true)}
          type="button"
        >
          Editar
        </button>
        <button
          className="rounded bg-red-600 px-3 py-2 text-white"
          onClick={handleDelete}
          type="button"
        >
          Excluir
        </button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
