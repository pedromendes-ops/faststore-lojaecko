import { useEffect, useState } from "react";

import type { SelectOption } from "../types";

const ESTADOS_URL = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";

/**
 * UFs vindas da API pública do IBGE (sem key), como no form legado —
 * `value` é a sigla e `label` o nome, que é o que o Master Data espera.
 */
export const useIbgeStates = () => {
  const [states, setStates] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(ESTADOS_URL, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: { sigla: string; nome: string }[]) =>
        setStates(
          data.map((state) => ({ value: state.sigla, label: state.nome })),
        ),
      )
      .catch(() => {
        // Silencioso: em caso de falha o campo Estado fica vazio.
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { states, loading };
};
