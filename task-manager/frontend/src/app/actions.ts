"use server";

import { redirect } from "next/navigation";

export async function buscar(formData: FormData) {
  const userId = Number(formData.get("userId"));

  if (!Number.isInteger(userId) || userId <= 0) return;

  redirect(`/tasks/${userId}`);
}
