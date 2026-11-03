// UsuariosPanel.tsx
// Painel com um botão para cada curl de /usuarios.
"use client";
import { useState } from "react";
import {
  ApiResult,
  UpdateUsuarioInput,
  localError,
  styles,
  toId,
  usuariosApi,
} from "../api";

export default function UsuariosPanel() {
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Criar
  const [createForm, setCreateForm] = useState({
    email: "",
    passwordHash: "",
    name: "",
  });

  // Buscar por ID
  const [getId, setGetId] = useState("");

  // Atualizar
  const [updateId, setUpdateId] = useState("");
  const [updateForm, setUpdateForm] = useState({
    email: "",
    passwordHash: "",
    name: "",
  });

  // Remover
  const [deleteId, setDeleteId] = useState("");

  async function run(action: () => Promise<ApiResult>) {
    setLoading(true);
    setResult(await action());
    setLoading(false);
  }

  function handleCreate() {
    const { email, passwordHash, name } = createForm;
    if (!email || !passwordHash || !name) {
      return setResult(localError("Preencha email, senha e nome."));
    }
    run(() => usuariosApi.create(createForm));
  }

  function handleGetById() {
    const id = toId(getId);
    if (!id) return setResult(localError("Informe um ID válido."));
    run(() => usuariosApi.getById(id));
  }

  function handleUpdate() {
    const id = toId(updateId);
    if (!id) return setResult(localError("Informe um ID válido."));

    // Envia apenas os campos preenchidos (PATCH parcial)
    const payload: UpdateUsuarioInput = {};
    if (updateForm.name) payload.name = updateForm.name;
    if (updateForm.email) payload.email = updateForm.email;
    if (updateForm.passwordHash) payload.passwordHash = updateForm.passwordHash;

    if (Object.keys(payload).length === 0) {
      return setResult(
        localError("Preencha pelo menos um campo para atualizar."),
      );
    }
    run(() => usuariosApi.update(id, payload));
  }

  function handleDelete() {
    const id = toId(deleteId);
    if (!id) return setResult(localError("Informe um ID válido."));
    if (
      !window.confirm(
        `Remover o usuário ${id}? Os recados dele também serão apagados.`,
      )
    ) {
      return;
    }
    run(() => usuariosApi.remove(id));
  }

  return (
    <div style={styles.container}>
      <h2>Usuários</h2>

      {/* Criar */}
      <div style={styles.section}>
        <h3 style={styles.title}>Criar usuário</h3>
        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="email"
            value={createForm.email}
            onChange={(e) =>
              setCreateForm({ ...createForm, email: e.target.value })
            }
          />
          <input
            style={styles.input}
            placeholder="senha (passwordHash)"
            type="password"
            value={createForm.passwordHash}
            onChange={(e) =>
              setCreateForm({ ...createForm, passwordHash: e.target.value })
            }
          />
          <input
            style={styles.input}
            placeholder="nome"
            value={createForm.name}
            onChange={(e) =>
              setCreateForm({ ...createForm, name: e.target.value })
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
        <h3 style={styles.title}>Listar usuários</h3>
        <button
          style={styles.button}
          onClick={() => run(usuariosApi.list)}
          disabled={loading}
        >
          Listar
        </button>
      </div>

      {/* Buscar por ID */}
      <div style={styles.section}>
        <h3 style={styles.title}>Buscar usuário por ID</h3>
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
          Atualizar usuário (só os campos preenchidos)
        </h3>
        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="ID"
            value={updateId}
            onChange={(e) => setUpdateId(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="novo nome"
            value={updateForm.name}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, name: e.target.value })
            }
          />
          <input
            style={styles.input}
            placeholder="novo email"
            value={updateForm.email}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, email: e.target.value })
            }
          />
          <input
            style={styles.input}
            placeholder="nova senha"
            type="password"
            value={updateForm.passwordHash}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, passwordHash: e.target.value })
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
        <h3 style={styles.title}>Remover usuário</h3>
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
