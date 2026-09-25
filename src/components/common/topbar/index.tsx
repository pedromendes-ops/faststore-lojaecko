import React from "react";
import { Carousel, Link } from "@faststore/ui";
import useScreenResize from "../MyScreenResize";
import { useSession } from "src/sdk/session";
import styles from "./styles.module.scss";

type ItemProps = {
  text: string;
};
type TopBarProps = {
  itensSlider: ItemProps[];
  itensMenu: {
    text: string;
    link: string;
    image?: string;
  }[];
};
export const TopBar = ({ itensMenu, itensSlider }: TopBarProps) => {
  const { isDesktop } = useScreenResize();
  const { person } = useSession();
  const isAuthenticated = Boolean(person?.id ?? person?.email);

  return (
    <section aria-label="topbar" className={styles["topbar"]}>
      <div className="wrap">
        <div className="container">
          <div
            className={styles["topbar-container"]}
          >
            {isDesktop && 
              <div data-fs-fill className={styles["topbar-fill"]} />
            }
             
            <div style={{ width: isDesktop  ? "30%" : "100%"}} className={styles["slider-topbar-container"]}>
              {itensSlider.length > 0 && (
                <Carousel
                  itemsPerPage={1}
                  variant="slide"
                  controls="navigationArrows"
                  infiniteMode
                >
                  {itensSlider.map((item, index) => (
                    <span className={styles["slider-item"]} key={index}>
                      {item.text}
                    </span>
                  ))}
                </Carousel>
              )}
            </div>
            {isDesktop && 
            <div data-fs-fill className={styles["menu-topbar-container"]}>
              <div className="flex items-center justify-end">
                {itensMenu.length > 0 && (
                  <ul className={styles["menu-topbar"]}>
                    {itensMenu.map((item, index) => {
                      const href =
                        item.link === "/login" && isAuthenticated
                          ? "/account#/profile"
                          : item.link;

                      return (
                        <li key={index}>
                          <Link href={href}>
                            {item.image && <img src={item.image} alt={item.text} />}
                            {item.text}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className={styles["menu-topbar-bandeira"]}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 18C24 18.7072 23.719 19.3855 23.219 19.8856C22.7189 20.3857 22.0406 20.6667 21.3333 20.6667H2.66667C1.95942 20.6667 1.28115 20.3857 0.781049 19.8856C0.280952 19.3855 0 18.7072 0 18V6C0 5.29276 0.280952 4.61448 0.781049 4.11438C1.28115 3.61429 1.95942 3.33333 2.66667 3.33333H21.3333C22.0406 3.33333 22.7189 3.61429 23.219 4.11438C23.719 4.61448 24 5.29276 24 6V18Z" fill="#009B3A"/>
                    <path d="M21.8187 12L12 19.416L2.18134 12L12 4.58333L21.8187 12Z" fill="#FEDF01"/>
                    <path d="M11.984 16.2547C14.3618 16.2547 16.2893 14.3271 16.2893 11.9493C16.2893 9.57156 14.3618 7.644 11.984 7.644C9.60621 7.644 7.67865 9.57156 7.67865 11.9493C7.67865 14.3271 9.60621 16.2547 11.984 16.2547Z" fill="#002776"/>
                    <path d="M8.18469 9.92467C7.96109 10.346 7.80966 10.8019 7.73669 11.2733C10.4 11.08 14.0147 12.534 15.566 14.3367C15.834 13.934 16.0327 13.4833 16.1547 13.0007C14.24 11.1287 10.8767 9.914 8.18469 9.92467Z" fill="#CBE9D4"/>
                    <path d="M8 12.1553H8.66667V12.822H8V12.1553ZM8.66667 13.4887H9.33333V14.1553H8.66667V13.4887Z" fill="#88C9F9"/>
                    <path d="M10 12.1553H10.6667V12.822H10V12.1553ZM11.3333 12.822H12V13.4887H11.3333V12.822ZM14 14.1553H14.6667V14.822H14V14.1553ZM12 14.822H12.6667V15.4887H12V14.822ZM14 10.822H14.6667V11.4887H14V10.822Z" fill="#55ACEE"/>
                    <path d="M12.6667 13.4887H13.3334V14.1553H12.6667V13.4887Z" fill="#3B88C3"/>
                  </svg>
                </div>
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    </section>
  );
};
