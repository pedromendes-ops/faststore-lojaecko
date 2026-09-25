import { usePLP } from "@faststore/core";

export interface CategorySEOData {
  aboutCategory: string | null;
  textSEO: string | null;
}

export interface UseTextSEOResult {
  data: CategorySEOData | null;
  isLoading: boolean;
}

/**
 * Reads the category SEO copy straight from the PLP context. The copy is
 * resolved server-side through the ServerCollectionPage fragment (see
 * src/fragments/ServerCollectionPage.ts and the StoreCollection resolver in
 * src/graphql/thirdParty/resolvers/textSEO.ts), so it is already present in the
 * server-rendered HTML — no client-side request, indexable and visible with JS
 * disabled.
 */
export function useTextSEO(): UseTextSEOResult {
  const plp = usePLP();
  const collection = plp?.data?.collection;

  return {
    data: collection
      ? {
          aboutCategory: collection.aboutCategory ?? null,
          textSEO: collection.textSEO ?? null,
        }
      : null,
    // Data is server-rendered, so there is never a client loading phase.
    isLoading: false,
  };
}
