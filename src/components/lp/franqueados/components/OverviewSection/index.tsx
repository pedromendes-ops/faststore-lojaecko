import { useScrollToAnchor } from "../../hooks/useScrollToAnchor";
import { RawSvg } from "../RawSvg";
import { SectionShell } from "../SectionShell";
import { FORM_ANCHOR_ID } from "../FranqueadoForm/constants";
import { OVERVIEW_BACKGROUNDS, OVERVIEW_CARDS } from "./content";
import styles from "./styles.module.scss";

/** BLOCO 13 — overview (faixa escura + 5 cards de vidro + CTA para o form). */
export const OverviewSection = () => {
  const scrollToForm = useScrollToAnchor(FORM_ANCHOR_ID);

  return (
    <SectionShell id="13" className={styles.section}>
      <div className="lojalevis-store-2-x-block-franqueado-13-container">
        <div
          className="lojalevis-store-2-x-block-franqueado-13-bg"
          aria-hidden="true"
        >
          {OVERVIEW_BACKGROUNDS.map((src, index) => (
            <img key={index} src={src} alt="" loading="lazy" />
          ))}
        </div>
  
        <div className="lojalevis-store-2-x-block-franqueado-13-content">
          <h3 className="vtex-rich-text-0-x-heading vtex-rich-text-0-x-heading--block-franqueado-13-title">
            Overview
          </h3>
  
          <div className="lojalevis-store-2-x-block-franqueado-13-cards">
            {OVERVIEW_CARDS.map((card) => (
              <div
                key={card.text}
                className="lojalevis-store-2-x-block-franqueado-13-card"
              >
                <RawSvg
                  svg={card.icon}
                  className="franqOverviewIcon"
                  style={{
                    width: `${card.iconWidth}px`,
                    height: `${card.iconHeight}px`,
                  }}
                />
                <p
                  className="vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--block-franqueado-13-card-text"
                  style={
                    card.textWidth ? { width: `${card.textWidth}px` } : undefined
                  }
                >
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <a
          href={`#${FORM_ANCHOR_ID}`}
          onClick={scrollToForm}
          className="lojalevis-store-2-x-block-franqueado-13-cta"
        >
          SEJA UM FRANQUEADO
        </a>
      </div>
    </SectionShell>
  );
};

export default OverviewSection;
