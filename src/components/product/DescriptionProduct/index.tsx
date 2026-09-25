import { usePDP } from "src/sdk/overrides/PageProvider";

import { DescriptionPanel } from "./components/DescriptionPanel";
import { useProductDetailsData } from "../ProductDetailsCustom/hooks/useProductDetailsData";
import ShortDescription from "./components/ShortDescription";
import type { DescriptionProductProps } from "./types";

import styles from "./styles.module.scss";

/**
 * Standalone PDP section that renders the product's short description (specs
 * such as "Composição"/"Corte" read from `isVariantOf.additionalProperty`) and
 * the full description accordion. Reads the product from `usePDP()`; its CMS schema
 * lives in `cms/faststore/components/cms_component__descriptionproduct.jsonc`.
 */
export const DescriptionProduct = ({
  productDescription,
}: DescriptionProductProps) => {
  const context = usePDP();
  const product = context?.data?.product;

  if (!product) {
    throw new Error("NotFound");
  }

  const data = useProductDetailsData(product);

  return (
    <section className={`section ${styles.description}`}>
      <div className={styles.description_container}>
        {productDescription.displayDescription && data.description && (
          <DescriptionPanel
            description={data.description}
            config={productDescription}
          />
        )}
        <ShortDescription properties={data.properties} />
      </div>
    </section>
  );
};

export default DescriptionProduct;
