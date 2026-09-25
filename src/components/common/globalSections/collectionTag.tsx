/**
 * Seção "CollectionTag" das Global Sections.
 *
 * Cadastro único, por coleção, das tags exibidas sobre a foto do ProductCard
 * ("New Arrivals" etc.). Como o PricePix, ela existe só para dar ao lojista um
 * formulário no CMS — não desenha nada na página. Adicione a seção uma vez por
 * coleção; a ordem no CMS é a prioridade da tag.
 *
 * Quem consome é o hook `useCollectionTags`
 * (src/sdk/globalSections/useCollectionTags.ts), lido pelo ProductClusters. Foi
 * preciso passar pelo BFF porque o RenderSections monta as global sections como
 * IRMÃS do `Children`: elas não envolvem a árvore da página e não teriam como
 * repassar os dados por contexto até um ProductCard.
 *
 * O componente segue registrado em src/components/index.tsx porque toda seção
 * presente no conteúdo do CMS precisa de um componente correspondente — sem
 * ele o RenderSections loga "CollectionTag not found" no console.
 */
type CollectionTagProps = {
  /** Id da coleção (product cluster) da VTEX. Ex.: "592". */
  collectionId: string;
  /** Texto exibido na tag. Ex.: "New Arrivals". */
  label: string;
  /** Cor do texto em hex. Ex.: "#000". */
  color: string;
};

export const CollectionTag = (_props: CollectionTagProps) => null;
