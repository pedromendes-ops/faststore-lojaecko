import type { ReactNode } from "react";
import Link from "src/components/ui/Link";
import { Viewer } from "../../ui/viewer";
import { RichText } from "../richText";

import styles from "./FooterCustom.module.scss";
import { Collapsed } from "../../ui/collapsed";

type MenuItemType = "link" | "text";

type MenuItem = {
  // "link" renderiza um Link (ou span, quando sem URL).
  // "text" renderiza um RichText (aceita **negrito** e \n para quebra de linha).
  type?: MenuItemType;
  text?: string;
  link?: string;
  newAba?: boolean;
  bold?: boolean;
};

type ImageItem = {
  imageUrl?: string;
  alt?: string;
  link?: string;
  newAba?: boolean;
};

type ColumnGroup = {
  title?: string;
  // Cada grupo pode ser de imagens (isImage) ou de menu normal.
  isImage?: boolean;
  menu?: MenuItem[];
  images?: ImageItem[];
};

type ColumnItem = {
  // Uma coluna pode ter vários grupos (cada um com seu título), e cada grupo
  // pode ser de imagens ou de menu.
  groups?: ColumnGroup[];
};

type Copywrite = {
  text?: string;
  imagesLogo?: ImageItem[];
  imagesSocialMedia?: ImageItem[];
};

type Props = {
  about?: string;
  items?: ColumnItem[];
  copywrite?: Copywrite;
};

// Wraps children with a Link when a URL is provided, otherwise renders a plain
// span — we never emit a bare <a> tag (uses src/components/ui/Link).
const MaybeLink = ({
  link,
  newAba,
  className,
  children,
}: {
  link?: string;
  newAba?: boolean;
  className?: string;
  children: ReactNode;
}) => {
  if (!link) {
    return <span className={className}>{children}</span>;
  }

  return (
    <Link
      href={link}
      className={className}
      {...(newAba ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </Link>
  );
};

const ImageList = ({
  images,
  className,
}: {
  images: ImageItem[];
  className: string;
}) => (
  <div className={className}>
    {images.map((image, index) => (
      <MaybeLink
        key={index}
        link={image.link}
        newAba={image.newAba}
        className={styles.imageLink}
      >
        <img src={image.imageUrl} alt={image.alt ?? ""} loading="lazy" />
      </MaybeLink>
    ))}
  </div>
);

export const FooterCustom = ({ items = [], copywrite, about }: Props) => {
  return (
    <footer className={styles.footerCustom}>
        <div className={styles.collapsed}>
          <Collapsed title={<span className={styles['about--title']}>SOBRE A LEVI'S®</span>}>
            {about && <Viewer value={about} className={styles.about} />}
          </Collapsed>
        </div>
        <div className="wrap">
          <div className="container">
            <div className={styles.collumnOne}>
              <div className={styles.columns}>
                {items.map((column, columnIndex) => (
                  <div key={columnIndex} className={styles.column}>
                    {(column.groups ?? []).map((group, groupIndex) => (
                      <div key={groupIndex} className={styles.group}>
                        {group.title && (
                          <h3 className={styles.columnTitle}>{group.title}</h3>
                        )}

                        {group.isImage ? (
                          <ImageList
                            images={group.images ?? []}
                            className={styles.columnImages}
                          />
                        ) : (
                          <ul className={styles.menu}>
                            {(group.menu ?? []).map((menuItem, menuIndex) => (
                              <li key={menuIndex}>
                                {menuItem.type === "text" ? (
                                  <RichText
                                    text={menuItem.text}
                                    className={`${styles.menuText} ${
                                      menuItem.bold ? styles.bold : ""
                                    }`}
                                  />
                                ) : (
                                  <MaybeLink
                                    link={menuItem.link}
                                    newAba={menuItem.newAba}
                                    className={`${styles.menuLink} ${
                                      menuItem.bold ? styles.bold : ""
                                    }`}
                                  >
                                    {menuItem.text}
                                  </MaybeLink>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="wrap">
          <div className="container">
            {copywrite && (
          
              <div className={styles.copywrite}>
                {copywrite.text && (
                  <span className={styles.copywriteText}>{copywrite.text}</span>
                )}
                {!!copywrite.imagesLogo?.length && (
                  <ImageList
                    images={copywrite.imagesLogo}
                    className={styles.logos}
                  />
                )}

                {!!copywrite.imagesSocialMedia?.length && (
                  <ImageList
                    images={copywrite.imagesSocialMedia}
                    className={styles.socialMedia}
                  />
                )}
              </div>
            )}
          </div>
        </div>
    </footer>
  );
};

export default FooterCustom;
