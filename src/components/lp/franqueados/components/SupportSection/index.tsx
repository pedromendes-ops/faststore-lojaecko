import { SVG_SLASHES_10 } from "../../svgs";
import { RawSvg } from "../RawSvg";
import { SectionShell } from "../SectionShell";
import {
  SUPORTE_CARDS,
  SUPPORT_SIDE_IMAGES,
  WIDE_SUPPORT_CARD,
} from "./content";
import styles from "./styles.module.scss";

/** BLOCO 10 — suporte (painel branco com 7 cards + 2 fotos à direita). */
export const SupportSection = () => (
  <SectionShell id="10" className={styles.section}>
    <div className="lojalevis-store-2-x-block-franqueado-10-container">
      <div className="lojalevis-store-2-x-block-franqueado-10-content--text">
        <div className="vtex-rich-text-0-x-container vtex-rich-text-0-x-container--block-franqueado-10-content--text-title-content">
          <h3 className="vtex-rich-text-0-x-heading vtex-rich-text-0-x-heading--block-franqueado-10-title">
            Suporte
          </h3>
        </div>

        <div className="lojalevis-store-2-x-block-franqueado-10-content--cards">
          {SUPORTE_CARDS.map((card) => (
            <div
              key={card.title}
              className="lojalevis-store-2-x-block-franqueado-10-card"
              data-wide={card.title === WIDE_SUPPORT_CARD ? "true" : undefined}
            >
              <RawSvg svg={SVG_SLASHES_10} className="franqSlashes" />

              <img
                src={card.icon}
                alt=""
                loading="lazy"
                className="vtex-store-components-3-x-imageElement vtex-store-components-3-x-imageElement--block-franqueado-10-card-icon"
              />

              <p className="vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--block-franqueado-10-card-title">
                {card.title}
              </p>
              <p className="lh-copy vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--block-franqueado-10-card-text">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="lojalevis-store-2-x-block-franqueado-10-content--images">
        {SUPPORT_SIDE_IMAGES.map((src, index) => (
          <img
            key={index}
            src={src}
            alt=""
            loading="lazy"
            className="vtex-store-components-3-x-imageElement vtex-store-components-3-x-imageElement--block-franqueado-10-image"
          />
        ))}
      </div>
    </div>
  </SectionShell>
);

export default SupportSection;
