import Link from "next/link";
import useScreenResize from "src/sdk/ui/useScreenResize";

import styles from "./BannerHtml.module.scss";

type Props = {
  htmlBannerTextContent?: string;
  htmlBannerTextHasMore?: boolean;
  htmlBannerTextTypeMore?: string;
  htmlBannerTextPosition?: string;
  htmlBannerTextBackground?: string;
  htmlBannerTextColor?: string;
  htmlBannerTextClass?: string;
  htmlBannerTextDisplay: string;
  htmlBannerTextUrl: string;
  htmlBannerTextLink: string;
  htmlBannerCenterMobile: boolean;
};

export const BannerHtml = ({
  htmlBannerTextContent = "<p>Lorem impsum</p>",
  htmlBannerTextHasMore = true,
  htmlBannerTextTypeMore = "link",
  htmlBannerTextPosition = "between",
  htmlBannerTextBackground = "#cccccc",
  htmlBannerTextColor = "#000000",
  htmlBannerTextClass = "bannerTextHome",
  htmlBannerTextDisplay = "full",
  htmlBannerTextUrl = "#",
  htmlBannerTextLink = "Veja mais",
  htmlBannerCenterMobile = true,
}: Props) => {
  const { isDesktop } = useScreenResize();

  const center = htmlBannerCenterMobile ? "phoneCenter" : "noCenter";
  const direction =
    htmlBannerTextHasMore && htmlBannerTextPosition === "between" && isDesktop
      ? "row"
      : "column";

  const content = (
    <div
      className={`flex no-flex items-center ${styles.bannerHtml} ${
        styles[htmlBannerTextPosition || "nocl"]
      } ${styles[htmlBannerTextClass || "nocl"]} ${styles[center]}`}
      style={{
        background: htmlBannerTextBackground || "#fff",
        flexDirection: direction,
      }}
    >
      <div
        style={{ color: htmlBannerTextColor }}
        dangerouslySetInnerHTML={{ __html: htmlBannerTextContent }}
      />
      {htmlBannerTextHasMore && (
        <div className={`linkMore ${styles[htmlBannerTextTypeMore]}`}>
          <Link
            style={{ color: htmlBannerTextColor }}
            href={htmlBannerTextUrl || "#"}
            target="_self"
          >
            {htmlBannerTextLink}
          </Link>
        </div>
      )}
    </div>
  );
  if (htmlBannerTextDisplay === "container") {
    return (
      <section className="wrap section">
        <div className="container">{content}</div>
      </section>
    );
  }

  return <div className="wrap section banner-html--container">{content}</div>;
};

export default BannerHtml;
