import { useEffect, useState } from "react";
import { getBackendMessage } from "../gatways/gatway";

export function useBackendMessage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getBackendMessage()
      .then(setMessage)
      .catch(() => setError("Não foi possível conectar ao backend."));
  }, []);

  return { message, error };
}
