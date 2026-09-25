// Caminho relativo: o componente só existe nesta loja, então o alias `src/*`
// (que resolve para o core) não o alcança — mesma razão do useWishlist.
// Importa de `clusters` e não do `index` do componente para não criar ciclo:
// o ProductClusters é justamente quem consome este hook.
import type { ProductClusterBadge } from "../../components/product/ProductCard/compoments/productClusters/clusters";

import { useGlobalSections } from "./useGlobalSections";

/**
 * Props da seção "CollectionTag" como o lojista preenche no CMS. A seção é
 * cadastrada uma vez por coleção — a ordem no CMS é a prioridade da tag.
 */
type CollectionTagSection = {
  collectionId?: string | number;
  label?: string;
  color?: string;
};

const EMPTY: ProductClusterBadge[] = [];

/**
 * Tags de coleção cadastradas nas Global Sections, no formato que o
 * ProductClusters consome.
 *
 * Descarta entradas sem `collectionId` (campo obrigatório no schema, mas o
 * lojista pode salvar um rascunho incompleto) — sem id não há como casar com os
 * `productClusters` do produto.
 *
 * Lista vazia enquanto carrega ou sem cadastro; quem chama decide o fallback.
 */
export function useCollectionTags(): ProductClusterBadge[] {
  const sections = useGlobalSections<CollectionTagSection>("CollectionTag");

  if (!sections.length) {
    return EMPTY;
  }

  return sections.flatMap((section) => {
    const collectionId = String(section?.collectionId ?? "").trim();

    if (!collectionId) {
      return [];
    }

    return [
      {
        collectionId,
        label: section.label,
        color: section.color,
      },
    ];
  });
}
