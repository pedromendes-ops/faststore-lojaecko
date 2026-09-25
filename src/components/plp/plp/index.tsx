import {
  type ProductGalleryProps,
  ProductGalleryUI as ProductGallery,
} from "./productGallery";
import Section from "src/components/sections/Section";
import type { EmptyGalleryProps } from "src/components/sections/ProductGallery/EmptyGallery";

import { isPLP, isSearchPage, usePage } from "src/sdk/overrides/PageProvider";
import { getOverridableSection } from "src/sdk/overrides/getOverriddenSection";
import { ProductGalleryDefaultComponents } from "./sections/ProductGalleryDefaultComponents";
import dynamic from "next/dynamic";
const EmptyGallery = dynamic(
  () =>
    /* webpackChunkName: "EmptyGallery" */
    import("src/components/sections/ProductGallery/EmptyGallery"),
);

export interface ProductGallerySectionProps {
  searchTermLabel?: ProductGalleryProps["searchTermLabel"];
  totalCountLabel?: ProductGalleryProps["totalCountLabel"];
  filter: ProductGalleryProps["filter"];
  previousPageButton?: ProductGalleryProps["previousPageButton"];
  itemsPerPage?: ProductGalleryProps["itemsPerPage"];
  loadMorePageButton?: ProductGalleryProps["loadMorePageButton"];
  sortBySelector?: ProductGalleryProps["sortBySelector"];
  productCard?: ProductGalleryProps["productCard"];
  itemsPerRow?: ProductGalleryProps["itemsPerRow"];
  emptyGallery?: EmptyGalleryProps;
}

function ProductGallerySection({
  emptyGallery,
  ...otherProps
}: ProductGallerySectionProps) {
  const context = usePage<any>();
  const titleContext = context?.data?.collection?.seo?.title ?? "";
  const [title, searchTerm] = isSearchPage(context)
    ? [context?.data?.title, context?.data?.searchTerm]
    : isPLP(context)
    ? [titleContext]
    : [""];
  const totalCount = context?.data?.search?.products?.pageInfo?.totalCount ?? 0;

  if (context?.data?.search?.products && totalCount === 0) {
    return (
      <Section className={` section-product-gallery`}>
        <section data-testid="product-gallery" data-fs-product-listing>
          <EmptyGallery {...emptyGallery} />
        </section>
      </Section>
    );
  }

  return (
    <Section className={` section-product-gallery layout__section`}>
      <ProductGallery
        title={title}
        searchTerm={searchTerm}
        totalCount={totalCount}
        {...otherProps}
      />
    </Section>
  );
}

const ProductGalleryCustom = getOverridableSection<
  //@ts-ignore
  typeof ProductGallerySection
>("ProductGallery", ProductGallerySection, ProductGalleryDefaultComponents);

export default ProductGalleryCustom;
