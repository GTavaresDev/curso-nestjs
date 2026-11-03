"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("Carregando...");
  const [error, setError] = useState("");

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

    fetch(apiUrl)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Erro ao consultar o backend: ${response.status}`);
        }

        return response.text();
      })
      .then(setMessage)
      .catch(() => {
        setError("Não foi possível conectar ao backend.");
      });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Resposta do backend</h1>
        <p className="mt-4 text-xl">{error || message}</p>
      </div>
    </main>
  );
}
