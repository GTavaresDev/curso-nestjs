"use client";

import { useBackendMessage } from "./hooks/useBackendMessage";

export default function Home() {
  const { message, error } = useBackendMessage();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-3xl font-bold">{error || message}</p>
      </div>
    </main>
  );
}
