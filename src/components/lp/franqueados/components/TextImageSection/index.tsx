import { SectionShell } from "../SectionShell";
import styles from "./styles.module.scss";

type TextImageSectionProps = {
  /** `02` = texto à esquerda; `03` = imagem à esquerda. */
  variant: "02" | "03";
  title: string;
  paragraphs: string[];
  image: string;
  /** Classes extras no container do título (o bloco 02 recua o título). */
  titleClassName?: string;
};

/**
 * BLOCOS 02 e 03 — texto + imagem lado a lado. Eram duas árvores de marcação
 * idênticas a menos da ordem das colunas e dos handles numerados; aqui viram
 * um componente só, parametrizado pela `variant`.
 */
export const TextImageSection = ({
  variant,
  title,
  paragraphs,
  image,
  titleClassName,
}: TextImageSectionProps) => {
  const text = (
    <div className={`lojalevis-store-2-x-block-franqueado-${variant}-text-container`}>
      <div className={`lojalevis-store-2-x-block-franqueado-${variant}-text`}>
        <div
          className={`lojalevis-store-2-x-block-franqueado-${variant}-text--children`}
        >
          <div
            className={[
              "vtex-rich-text-0-x-container",
              "vtex-rich-text-0-x-container--franqueado--title-red",
              titleClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <h3 className="vtex-rich-text-0-x-heading vtex-rich-text-0-x-heading--franqueado--title-red">
              {title}
            </h3>
          </div>

          <div className="vtex-rich-text-0-x-container vtex-rich-text-0-x-container--franqueado--text">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="lh-copy vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--franqueado--text"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const picture = (
    <div className={`lojalevis-store-2-x-block-franqueado-${variant}-image`}>
      <img
        src={image}
        alt=""
        loading="lazy"
        className="vtex-store-components-3-x-imageElement vtex-store-components-3-x-imageElement--image-franqueado"
      />
    </div>
  );

  return (
    <SectionShell
      id={variant}
      modifier={`with-text-${variant}`}
      rowClassName="vtex-flex-layout-0-x-flexRow--block-franqueado-with-text"
      className={styles.section}
    >
      {variant === "02" ? (
        <>
          {text}
          {picture}
        </>
      ) : (
        <>
          {picture}
          {text}
        </>
      )}
    </SectionShell>
  );
};

export default TextImageSection;
