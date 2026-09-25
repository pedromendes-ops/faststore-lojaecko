import type { ProductDetailsData } from "../../../ProductDetailsCustom/hooks/useProductDetailsData";

import styles from "./styles.module.scss";

type Properties = ProductDetailsData["properties"];

interface ShortDescriptionField {
  /** Property name to match (VTEX `properties` / FastStore spec name). */
  property: string;
  /** Heading shown above the value. */
  title: string;
}

export interface ShortDescriptionProps {
  properties: Properties;
}

/**
 * FastStore port of the VTEX IO `ShortDescription`. The VTEX IO version read
 * `product.properties` (e.g. "Composição", "Corte"); in FastStore the same full
 * set of product-group specifications arrives in `isVariantOf.additionalProperty`
 * (exposed as `properties` by `useProductDetailsData`), each entry carrying
 * `valueReference: "SPECIFICATION"`.
 */
const FIELDS: ShortDescriptionField[] = [
  { property: "Corte", title: "Ajuste e tamanho" },
  { property: "Composição", title: "Composição" },
];

function getPropertyValue(properties: Properties, name: string): string | null {
  const match = properties?.find((item) => item.name === name);

  // `value` is typed as `any` in the schema; properties resolve to a string.
  return match?.value != null ? String(match.value) : null;
}

export function ShortDescription({ properties }: ShortDescriptionProps) {
  const fields = FIELDS.map((field) => ({
    ...field,
    value: getPropertyValue(properties, field.property),
  })).filter((field) => Boolean(field.value));

  if (!fields.length) {
    return null;
  }

  return (
    <div data-fs-short-description className={styles.shortDescription}>
      {fields.map(({ property, title, value }, index) => (
        <div data-fs-short-description-field key={property}>
          <h2
            data-fs-short-description-title
            className={styles.title}
            data-fs-short-description-title-second={index == 1}
          >
            {title}
          </h2>
          <ul className={styles.list}>
            <li data-fs-short-description-value className={styles.value}>
              {value}
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ShortDescription;
