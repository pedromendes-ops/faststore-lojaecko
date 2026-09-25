import Link from "next/link";
import type { Column } from "../../menu.typing";
import styles from "./styles.module.scss";

type MenuDesktopDropdownProps = {
  columns: Column[];
};

export const MenuDesktopDropdown = ({ columns }: MenuDesktopDropdownProps) => {
  return (
    <div className={styles.dropdownInner}>
      {columns.map((col, colIndex) => (
        <div key={colIndex} className={styles.column}>
          {col.departments.map((dept, deptIndex) => (
            <div key={deptIndex} className={styles.department}>
              {dept.title && (
                <h3 className={styles.columnTitle}>{dept.title}</h3>
              )}
              {dept.subCategoria.length > 0 && (
                <ul className={styles.linkList}>
                  {dept.subCategoria.map((sub, i) => (
                    <li key={i}>
                      <Link
                        href={sub.link || "#"}
                        target={sub.openNewTab ? "_blank" : "_self"}
                        rel={sub.openNewTab ? "noopener noreferrer" : undefined}
                        className={`${styles.link} ${sub.destaque ? styles.linkDestaque : ""}`}
                      >
                        {sub.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {col.image?.imageUrl && (
            <Link href={col.image.href || "#"} className={styles.imageLink}>
              <img
                src={col.image.imageUrl}
                alt={col.image.alt}
                className={styles.image}
                loading="lazy"
              />
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};
