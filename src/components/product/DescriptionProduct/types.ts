/**
 * CMS-editable props for the standalone DescriptionProduct section.
 *
 * Holds the product description accordion config that previously lived inside
 * the ProductDetailsCustom section. Each field maps 1:1 to a property in
 * `cms/faststore/components/cms_component__descriptionproduct.jsonc`.
 */
export interface DescriptionProductProps {
  productDescription: {
    title: string;
    displayDescription: boolean;
    initiallyExpanded: "first" | "all" | "none";
    accordionAriaLabel?: string;
  };
}
