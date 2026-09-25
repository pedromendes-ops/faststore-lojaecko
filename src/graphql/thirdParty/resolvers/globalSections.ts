// Proxy backend-only do Content Platform (data plane) para ler as Global
// Sections da loja. Mesmo padrão dos outros resolvers third-party: o browser
// nunca fala com a API da VTEX direto, só com /api/graphql. Ver o typeDef em
// src/graphql/thirdParty/typeDefs/globalSections.graphql.
//
// Rotas usadas (as mesmas do @vtex/client-cp, mas via fetch para não depender
// de um pacote que é dependência transitiva do core):
//   GET .../globalSections/entries            → lista as entries
//   GET .../globalSections/entries/{entryId}  → conteúdo da entry
//
// A entry é descoberta pela listagem em vez de ter o id fixo no código, para
// o resolver continuar funcionando se a entry de Global Sections for recriada.

import storeConfig from "discovery.config";

// Metadados que o CMS injeta em toda seção e que não fazem parte das props.
const CMS_METADATA_KEYS = ["$componentKey", "$componentTitle"] as const;

// Só a forma mínima que a gente lê de cada payload.
interface RawSection {
  $componentKey?: string;
  [key: string]: unknown;
}

interface RawEntryList {
  entries?: Array<{ id?: string }> | null;
}

interface RawEntry {
  sections?: RawSection[] | null;
}

// Forma devolvida pelo resolver, espelhando o tipo GlobalSection.
interface GlobalSectionResult {
  name: string;
  data: Record<string, unknown>;
}

const ACCOUNT = storeConfig.api.storeId;

// `contentSource.project` é o "storeId" do Content Platform (não confundir com
// `api.storeId`, que é a conta). "faststore" é o valor padrão dos projetos.
const PROJECT =
  (storeConfig as { contentSource?: { project?: string } }).contentSource
    ?.project ?? "faststore";

const CP_ENTRIES_URL =
  `https://${ACCOUNT}.${storeConfig.api.environment}.com.br` +
  `/api/content-platform/data/${ACCOUNT}/${PROJECT}/globalSections/entries`;

// Conteúdo de CMS muda raramente e este payload é global (igual para todo
// shopper), então vale segurar o resultado em memória. Memoiza a promise em
// voo, como o textSEO faz, para que uma rajada de requisições no boot do
// servidor gere uma única ida à API — e para que N seções diferentes
// (PricePix, CollectionTag, ...) compartilhem o mesmo fetch.
const CACHE_TTL_MS = 5 * 60_000;
let cache: { at: number; promise: Promise<GlobalSectionResult[]> } | null = null;

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { Accept: "application/json" } });

  if (!response.ok) {
    throw new Error(`Content Platform request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

async function requestGlobalSections(): Promise<GlobalSectionResult[]> {
  const list = await getJson<RawEntryList>(CP_ENTRIES_URL);
  const entryId = list.entries?.[0]?.id;

  if (!entryId) {
    return [];
  }

  const entry = await getJson<RawEntry>(
    `${CP_ENTRIES_URL}/${encodeURIComponent(entryId)}`,
  );

  return (entry.sections ?? []).flatMap((section) => {
    const name = section?.$componentKey;

    if (!name) {
      return [];
    }

    const data = { ...section };
    for (const key of CMS_METADATA_KEYS) {
      delete data[key];
    }

    return [{ name, data }];
  });
}

function fetchGlobalSections(): Promise<GlobalSectionResult[]> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.promise;
  }

  const promise = requestGlobalSections().catch(() => {
    // Uma falha aqui nunca pode derrubar a página: devolve lista vazia e deixa
    // o front usar os defaults dos componentes.
    return [] as GlobalSectionResult[];
  });

  cache = { at: Date.now(), promise };

  return promise;
}

const globalSectionsResolver = {
  Query: {
    globalSections: async (
      _: unknown,
      args: { names: string[] },
    ): Promise<GlobalSectionResult[]> => {
      const wanted = new Set(args?.names ?? []);

      if (wanted.size === 0) {
        return [];
      }

      const sections = await fetchGlobalSections();

      return sections.filter((section) => wanted.has(section.name));
    },
  },
};

export default globalSectionsResolver;
