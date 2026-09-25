import { useEffect, useState } from "react";

import type { SelectOption } from "../types";

const municipiosUrl = (uf: string) =>
  `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`;

/**
 * Municípios da UF selecionada (API pública do IBGE, sem key).
 *
 * Camada de dados isolada do formulário: quem consome só recebe a lista e o
 * estado de carregamento. Em caso de falha a lista volta vazia (silencioso),
 * mesmo comportamento do form legado.
 */
export const useIbgeCities = (uf: string) => {
  const [cities, setCities] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uf) {
      setCities([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setCities([]);

    fetch(municipiosUrl(uf), { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: { nome: string }[]) =>
        setCities(data.map((city) => ({ value: city.nome, label: city.nome }))),
      )
      .catch(() => {
        // Silencioso: em caso de falha o campo Cidade fica vazio.
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [uf]);

  return { cities, loading };
};
