const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function getBackendMessage(): Promise<string> {
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Erro ao consultar o backend: ${response.status}`);
  }

  return response.text();
}
