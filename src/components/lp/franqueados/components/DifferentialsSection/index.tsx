import { useDevice } from "../../../../hooks/useDevice";
import { SVG_CARD_04_NEW, SVG_CARD_MOBILE } from "../../svgs";
import { IntersectCard } from "../IntersectCard";
import { SectionShell } from "../SectionShell";
import { DIFERENCIAIS, DIFFERENTIALS_IMAGES } from "./content";
import styles from "./styles.module.scss";

/** BLOCO 07 — diferenciais da marca (banner de fundo + 4 cards angulares). */
export const DifferentialsSection = () => {
  const { isDesktop } = useDevice();

  return (
    <SectionShell id="07" className={styles.section}>
      <div className="lojalevis-store-2-x-block-franqueado-07-container">
        <img
          src={DIFFERENTIALS_IMAGES.banner}
          alt=""
          loading="lazy"
          className="vtex-store-components-3-x-imageElement"
        />

        <div className="lojalevis-store-2-x-block-franqueado-07-content">
          <div className="lojalevis-store-2-x-block-franqueado-07-content-image">
            <img
              src={DIFFERENTIALS_IMAGES.logo}
              alt="Levi’s®"
              loading="lazy"
              className="vtex-store-components-3-x-imageElement vtex-store-components-3-x-imageElement--block-franqueado-07-content-image-levis-logo"
            />
            <p className="vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--block-franqueado-07-content-title">
              Quais os diferenciais da marca
            </p>
          </div>

          <div className="lojalevis-store-2-x-block-franqueado-07-content-card--container">
            {DIFERENCIAIS.map((text, index) => (
              <IntersectCard
                key={index}
                svg={isDesktop ? SVG_CARD_04_NEW : SVG_CARD_MOBILE}
                className="lojalevis-store-2-x-block-franqueado-07-card-intersect"
              >
                {text}
              </IntersectCard>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

export default DifferentialsSection;
