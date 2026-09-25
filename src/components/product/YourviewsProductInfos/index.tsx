import React from "react";
import { usePDP } from "@faststore/core";

export default function YourviewsProductInfos() {
  const pdp = usePDP();

  return (
    <div>
      <input
        id="yv-productId"
        type="hidden"
        value={pdp?.data?.product?.isVariantOf?.productGroupID}
      />
      <input
        id="yv-productName"
        type="hidden"
        value={pdp?.data?.product?.name}
      />
      <input
        id="yv-productImage"
        type="hidden"
        value={pdp?.data?.product?.image[0]?.url}
      />
      <input
        id="yv-productPrice"
        type="hidden"
        value={pdp?.data?.product?.offers?.lowPrice}
      />
      <input
        id="yv-productCategory"
        type="hidden"
        value={
          pdp?.data?.product?.breadcrumbList?.itemListElement[
            pdp?.data?.product?.breadcrumbList?.itemListElement?.length - 2
          ]?.name
        }
      />
    </div>
  );
}
