import Link from "next/link";
import type { MobileLinkFooter } from "../../menu.typing";
import styles from "./styles.module.scss";
import { useSession } from "src/sdk/session";

type MenuMobileFooterProps = {
  mobileLinkFooter: MobileLinkFooter[] | undefined;
};
export const MenuMobileFooter = ({
  mobileLinkFooter,
}: MenuMobileFooterProps) => {
  const { person } = useSession();
  const isAuthenticated = Boolean(person?.id ?? person?.email);
  return (
    <div className={styles.footer}>
      <div className={styles.footerContent}>
        <ul className={styles.footerList}>
          {mobileLinkFooter?.map((link, i) => {
            const href =
              link.link === "/login" && isAuthenticated
                ? "/account#/profile"
                : link.link;
            return (
              <li key={i}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerLink}
                >
                  <img
                    src={link.iconUrl}
                    alt={link.alt}
                    width="24"
                    height="24"
                  />
                  {link.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
