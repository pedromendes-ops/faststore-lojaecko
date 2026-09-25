import type { Categoria } from "../../menu.typing";
import styles from "./styles.module.scss";

import Link from "next/link";

type MenuDesktopCategoriesProps = {
  categorias: Categoria[];
};

export const MenuDesktopCategories = ({
  categorias,
}: MenuDesktopCategoriesProps) => {
  return (
    <>
      {categorias?.length > 0 && (
        <div className={styles.container}>
          <div className={styles.categorias}>
            {categorias.map((cat, i) => (
              <Link
                key={i}
                href={cat.link || "#"}
                className={styles.categoriaItem}
              >
                {cat.icon && (
                  <img
                    src={cat.icon}
                    alt={cat.text}
                    width={20}
                    height={20}
                    loading="lazy"
                  />
                )}
                <span>{cat.text}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
