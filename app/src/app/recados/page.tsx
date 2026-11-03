// RecadosPanel.tsx
// Painel com um botão para cada curl de /recados.
// Lembre-se: "de" e "para" são IDs de usuários que já existem.
"use client";
import { useState } from "react";
import {
  ApiResult,
  UpdateRecadoInput,
  localError,
  recadosApi,
  styles,
  toId,
} from "../api";

export default function RecadosPanel() {
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ limit: "10", offset: "0" });

  // Criar
  const [createForm, setCreateForm] = useState({ texto: "", de: "", para: "" });

  // Buscar por ID
  const [getId, setGetId] = useState("");

  // Atualizar
  const [updateId, setUpdateId] = useState("");
  const [updateForm, setUpdateForm] = useState({ texto: "", de: "", para: "" });

  // Remover
  const [deleteId, setDeleteId] = useState("");

  async function run(action: () => Promise<ApiResult>) {
    setLoading(true);
    setResult(await action());
    setLoading(false);
  }

  function handleCreate() {
    const de = toId(createForm.de);
    const para = toId(createForm.para);

    if (createForm.texto.trim().length < 3) {
      return setResult(localError("O texto deve ter pelo menos 3 caracteres."));
    }
    if (!de || !para) {
      return setResult(
        localError(
          '"de" e "para" devem ser IDs de usuários (números inteiros).',
        ),
      );
    }
    run(() => recadosApi.create({ texto: createForm.texto, de, para }));
  }

  function handleGetById() {
    const id = toId(getId);
    if (!id) return setResult(localError("Informe um ID válido."));
    run(() => recadosApi.getById(id));
  }

  function handleList() {
    const limit = Number(pagination.limit);
    const offset = Number(pagination.offset);
    if (
      !Number.isInteger(limit) ||
      limit < 0 ||
      !Number.isInteger(offset) ||
      offset < 0
    ) {
      return setResult(
        localError("Limit e offset devem ser números inteiros maiores ou iguais a zero."),
      );
    }
    run(() => recadosApi.list({ limit, offset }));
  }

  function handleUpdate() {
    const id = toId(updateId);
    if (!id) return setResult(localError("Informe um ID válido."));

    // Envia apenas os campos preenchidos (PATCH parcial)
    const payload: UpdateRecadoInput = {};
    if (updateForm.texto) payload.texto = updateForm.texto;

    if (updateForm.de) {
      const de = toId(updateForm.de);
      if (!de) return setResult(localError('"de" deve ser um ID válido.'));
      payload.de = de;
    }
    if (updateForm.para) {
      const para = toId(updateForm.para);
      if (!para) return setResult(localError('"para" deve ser um ID válido.'));
      payload.para = para;
    }

    if (Object.keys(payload).length === 0) {
      return setResult(
        localError("Preencha pelo menos um campo para atualizar."),
      );
    }
    run(() => recadosApi.update(id, payload));
  }

  function handleDelete() {
    const id = toId(deleteId);
    if (!id) return setResult(localError("Informe um ID válido."));
    if (!window.confirm(`Remover o recado ${id}?`)) return;
    run(() => recadosApi.remove(id));
  }

  return (
    <div style={styles.container}>
      <h2>Recados</h2>

      {/* Criar */}
      <div style={styles.section}>
        <h3 style={styles.title}>Criar recado</h3>
        <div style={styles.row}>
          <input
            style={{ ...styles.input, minWidth: 220 }}
            placeholder="texto"
            value={createForm.texto}
            onChange={(e) =>
              setCreateForm({ ...createForm, texto: e.target.value })
            }
          />
          <input
            style={styles.input}
            placeholder="de (ID do usuário)"
            value={createForm.de}
            onChange={(e) =>
              setCreateForm({ ...createForm, de: e.target.value })
            }
          />
          <input
            style={styles.input}
            placeholder="para (ID do usuário)"
            value={createForm.para}
            onChange={(e) =>
              setCreateForm({ ...createForm, para: e.target.value })
            }
          />
          <button
            style={styles.button}
            onClick={handleCreate}
            disabled={loading}
          >
            Criar
          </button>
        </div>
      </div>

      {/* Listar */}
      <div style={styles.section}>
        <h3 style={styles.title}>Listar recados</h3>
        <div style={styles.row}>
          <label>
            Limit{" "}
            <input
              style={styles.input}
              type="number"
              min="0"
              value={pagination.limit}
              onChange={(e) =>
                setPagination({ ...pagination, limit: e.target.value })
              }
            />
          </label>
          <label>
            Offset{" "}
            <input
              style={styles.input}
              type="number"
              min="0"
              value={pagination.offset}
              onChange={(e) =>
                setPagination({ ...pagination, offset: e.target.value })
              }
            />
          </label>
          <button
            style={styles.button}
            onClick={handleList}
            disabled={loading}
          >
            Listar
          </button>
        </div>
      </div>

      {/* Buscar por ID */}
      <div style={styles.section}>
        <h3 style={styles.title}>Buscar recado por ID</h3>
        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="ID"
            value={getId}
            onChange={(e) => setGetId(e.target.value)}
          />
          <button
            style={styles.button}
            onClick={handleGetById}
            disabled={loading}
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Atualizar */}
      <div style={styles.section}>
        <h3 style={styles.title}>
          Atualizar recado (só os campos preenchidos)
        </h3>
        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="ID"
            value={updateId}
            onChange={(e) => setUpdateId(e.target.value)}
          />
          <input
            style={{ ...styles.input, minWidth: 220 }}
            placeholder="novo texto"
            value={updateForm.texto}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, texto: e.target.value })
            }
          />
          <input
            style={styles.input}
            placeholder="novo de (ID)"
            value={updateForm.de}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, de: e.target.value })
            }
          />
          <input
            style={styles.input}
            placeholder="novo para (ID)"
            value={updateForm.para}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, para: e.target.value })
            }
          />
          <button
            style={styles.button}
            onClick={handleUpdate}
            disabled={loading}
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* Remover */}
      <div style={styles.section}>
        <h3 style={styles.title}>Remover recado</h3>
        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="ID"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
          />
          <button
            style={styles.buttonDanger}
            onClick={handleDelete}
            disabled={loading}
          >
            Remover
          </button>
        </div>
      </div>

      {/* Resultado */}
      <h3 style={styles.title}>Resposta</h3>
      <pre style={styles.resultBox}>
        {loading
          ? "Carregando..."
          : result
            ? `${result.request}\nStatus: ${result.status} ${result.ok ? "(ok)" : "(erro)"}\n\n${
                result.data === null
                  ? "(sem conteúdo)"
                  : JSON.stringify(result.data, null, 2)
              }`
            : "Clique em um botão para executar a requisição."}
      </pre>
    </div>
  );
}
