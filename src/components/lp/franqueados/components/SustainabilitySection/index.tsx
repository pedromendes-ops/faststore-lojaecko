import { useDevice } from "../../../../hooks/useDevice";
import { SVG_06_MOBILE, SVG_CARD_04 } from "../../svgs";
import { IntersectCard } from "../IntersectCard";
import { SectionShell } from "../SectionShell";
import {
  SUSTAINABILITY_CARDS,
  SUSTAINABILITY_IMAGE,
  SUSTAINABILITY_RIBBON,
} from "./content";
import styles from "./styles.module.scss";

/** BLOCO 06 — sustentabilidade (foto de fundo + painel com 6 cards + faixa). */
export const SustainabilitySection = () => {
  const { isDesktop } = useDevice();

  return (
    <SectionShell id="06" className={styles.section}>
      <div className="lojalevis-store-2-x-block-franqueado-06-container">
        <div className="lojalevis-store-2-x-block-franqueado-06-content-01">
          <img
            src={SUSTAINABILITY_IMAGE}
            alt=""
            loading="lazy"
            className="vtex-store-components-3-x-imageElement vtex-store-components-3-x-imageElement--block-franqueado-06-image"
          />
        </div>

        <div className="lojalevis-store-2-x-block-franqueado-06-content-02">
          <div className="vtex-rich-text-0-x-container vtex-rich-text-0-x-container--block-franqueado-06-content-02-title">
            <h3 className="vtex-rich-text-0-x-heading vtex-rich-text-0-x-heading--block-franqueado-06-content-02-title">
              <span className="b vtex-rich-text-0-x-strong vtex-rich-text-0-x-strong--block-franqueado-06-content-02-title">
                SUSTENTABILIDADE
              </span>{" "}
              ESTÁ EM TUDO O QUE FAZEMOS
            </h3>
          </div>

          <div className="lojalevis-store-2-x-block-franqueado-06-content-02-container-cards">
            {SUSTAINABILITY_CARDS.map((card, index) => (
              <div
                key={index}
                className="lojalevis-store-2-x-block-franqueado-06-content-02-card"
              >
                <img
                  src={card.icon}
                  alt=""
                  loading="lazy"
                  className="vtex-store-components-3-x-imageElement vtex-store-components-3-x-imageElement--block-franqueado-06-content-02-card-image"
                />
                <div className="vtex-rich-text-0-x-container vtex-rich-text-0-x-container--block-franqueado-06-content-02-card-text">
                  <p className="lh-copy vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--block-franqueado-06-content-02-card-text">
                    {card.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <IntersectCard
            svg={isDesktop ? SVG_CARD_04 : SVG_06_MOBILE}
            className="lojalevis-store-2-x-block-franqueado-06-card-intersect"
          >
            {SUSTAINABILITY_RIBBON}
          </IntersectCard>
        </div>
      </div>
    </SectionShell>
  );
};

export default SustainabilitySection;
