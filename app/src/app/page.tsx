// src/app/page.tsx (pode continuar como Server Component)
import UsuariosPanel from "./usuarios/page";
import RecadosPanel from "./recados/page";

export default function Home() {
  return (
    <>
      <UsuariosPanel />
      <RecadosPanel />
    </>
  );
}
