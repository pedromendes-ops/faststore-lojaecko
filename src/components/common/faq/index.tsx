import { FAQPageJsonLd } from "next-seo";

import { FaqItem } from "./components/FaqItem";
import { useFaqStructuredData } from "./hooks/useFaqStructuredData";
import type { FaqProps } from "./types";

import styles from "./faq.module.scss";

export const Faq = ({ title, items = [] }: FaqProps) => {
  const { mainEntity } = useFaqStructuredData(items);

  if (!items.length) return null;

  return (
    <div className={styles.faq}>
      {mainEntity.length > 0 && <FAQPageJsonLd mainEntity={mainEntity} />}

      {title && <h2 className={styles.title}>{title}</h2>}

      <div className={styles.list}>
        {items.map((item, index) => (
          <FaqItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Faq;
