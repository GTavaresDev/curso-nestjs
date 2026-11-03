// api.ts
// Cliente HTTP + tipos + estilos compartilhados pelos painéis de Usuários e Recados.

import type { CSSProperties } from "react";

// Troque aqui se a sua API rodar em outra porta/endereço
export const API_URL = "http://localhost:3000";

/* ----------------------------- Tipos ----------------------------- */

export interface ApiResult {
  request: string; // ex.: "POST http://localhost:3000/usuarios"
  ok: boolean;
  status: number; // 0 = falha de rede/CORS
  data: unknown;
}

export interface CreateUsuarioInput {
  email: string;
  passwordHash: string;
  name: string;
}
export type UpdateUsuarioInput = Partial<CreateUsuarioInput>;

export interface CreateRecadoInput {
  texto: string;
  de: number; // ID do usuário remetente
  para: number; // ID do usuário destinatário
}
export type UpdateRecadoInput = Partial<CreateRecadoInput>;
export interface RecadosPagination {
  limit?: number;
  offset?: number;
}

/* ------------------------- Requisição base ------------------------ */

async function request(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
): Promise<ApiResult> {
  const url = `${API_URL}${path}`;
  const label = `${method} ${url}`;

  try {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    return { request: label, ok: res.ok, status: res.status, data };
  } catch (error) {
    return {
      request: label,
      ok: false,
      status: 0,
      data: {
        error:
          "Não foi possível chamar a API. Verifique se ela está rodando e se o CORS está habilitado (app.enableCors()).",
        detail: String(error),
      },
    };
  }
}

/* ----------------------------- Usuários --------------------------- */

export const usuariosApi = {
  create: (input: CreateUsuarioInput) => request("POST", "/usuarios", input),
  list: () => request("GET", "/usuarios"),
  getById: (id: number) => request("GET", `/usuarios/${id}`),
  update: (id: number, input: UpdateUsuarioInput) =>
    request("PATCH", `/usuarios/${id}`, input),
  remove: (id: number) => request("DELETE", `/usuarios/${id}`),
};

/* ------------------------------ Recados --------------------------- */

export const recadosApi = {
  create: (input: CreateRecadoInput) => request("POST", "/recados", input),
  list: ({ limit, offset }: RecadosPagination = {}) => {
    const params = new URLSearchParams();
    if (limit !== undefined) params.set("limit", String(limit));
    if (offset !== undefined) params.set("offset", String(offset));
    const query = params.toString();
    return request("GET", `/recados${query ? `?${query}` : ""}`);
  },
  getById: (id: number) => request("GET", `/recados/${id}`),
  update: (id: number, input: UpdateRecadoInput) =>
    request("PATCH", `/recados/${id}`, input),
  remove: (id: number) => request("DELETE", `/recados/${id}`),
};

/* ------------------------------ Helpers --------------------------- */

// Converte texto do input em ID válido (inteiro positivo) ou null
export function toId(value: string): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// Cria um resultado local (ex.: erro de validação antes de chamar a API)
export function localError(message: string): ApiResult {
  return {
    request: "Validação local",
    ok: false,
    status: 0,
    data: { error: message },
  };
}

/* ------------------------------ Estilos --------------------------- */

export const styles: Record<string, CSSProperties> = {
  container: {
    fontFamily: "system-ui, sans-serif",
    maxWidth: 760,
    margin: "0 auto",
    padding: 16,
  },
  section: {
    border: "1px solid #d0d7de",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  title: { margin: "0 0 8px", fontSize: 16 },
  row: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
  input: {
    padding: "6px 8px",
    border: "1px solid #b0b7be",
    borderRadius: 6,
    minWidth: 150,
  },
  button: {
    padding: "6px 12px",
    border: "none",
    borderRadius: 6,
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
  buttonDanger: {
    padding: "6px 12px",
    border: "none",
    borderRadius: 6,
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
  },
  resultBox: {
    background: "#0f172a",
    color: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    overflow: "auto",
    maxHeight: 320,
    whiteSpace: "pre-wrap",
  },
};
