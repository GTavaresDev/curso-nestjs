import { buscar } from "./actions";

export default function Home() {
  return (
    <div>
      <form action={buscar}>
        <label htmlFor="userId">ID do usuário:</label>
        <input id="userId" name="userId" type="number" min="1" required />
        <button type="submit">Buscar</button>
      </form>
    </div>
  );
}
