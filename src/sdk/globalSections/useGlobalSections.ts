import { gql } from "@faststore/core/api";
import { useQuery_unstable as useQuery } from "@faststore/core/experimental";
import type {
  GlobalSectionsQueryQuery,
  GlobalSectionsQueryQueryVariables,
} from "@generated/graphql";

/**
 * Leitura genérica das Global Sections cadastradas no Content Platform, pelo
 * BFF — ver src/graphql/thirdParty/resolvers/globalSections.ts.
 *
 * Serve de base para qualquer seção usada como "configuração global da loja"
 * (PricePix, CollectionTag, ...). Para uma seção nova não é preciso mexer no
 * resolver nem no schema: basta um hook tipado por cima daqui, como o
 * usePricePix e o useCollectionTags fazem.
 *
 * O nome da operação termina em "Query" de propósito: o handler /api/graphql do
 * core só aplica `s-maxage` a operações com esse sufixo, e estes dados são
 * globais (idênticos para todo shopper), então podem e devem ser cacheados na
 * borda.
 */
const GLOBAL_SECTIONS = gql(`
  query GlobalSectionsQuery($names: [String!]!) {
    globalSections(names: $names) {
      name
      data
    }
  }
`);

const EMPTY: never[] = [];

/**
 * Todas as seções com esse nome, na ordem do CMS, já com as props tipadas como
 * `T`. Lista vazia enquanto o SWR carrega, quando a seção não está cadastrada
 * ou quando o Content Platform falhou — quem chama decide o default.
 *
 * `T` é uma promessa, não uma garantia: o conteúdo vem do JSON que o lojista
 * preencheu no CMS. Trate os campos como opcionais e valide o que for crítico.
 *
 * O SWR deduplica pela chave `operação + variáveis`, então todos os componentes
 * que pedirem a mesma seção compartilham uma única requisição.
 */
export function useGlobalSections<T>(name: string): T[] {
  const { data } = useQuery<
    GlobalSectionsQueryQuery,
    GlobalSectionsQueryQueryVariables
  >(GLOBAL_SECTIONS, { names: [name] });

  return (data?.globalSections?.map((section) => section.data as T) ??
    EMPTY) as T[];
}

/**
 * Açúcar para as seções que só fazem sentido uma vez (PricePix, por exemplo).
 * Devolve a primeira ocorrência, ou `null`.
 */
export function useGlobalSection<T>(name: string): T | null {
  return useGlobalSections<T>(name)[0] ?? null;
}
