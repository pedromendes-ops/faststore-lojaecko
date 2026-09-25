import { useDevice } from "../../../../hooks/useDevice";
import { FranqueadoForm } from "../FranqueadoForm";
import { HERO_IMAGES } from "./content";
import styles from "./styles.module.scss";

/**
 * BLOCO 01 — banner + formulário. Não usa a `SectionShell`: a casca dele é a
 * única diferente (flexCol com dois filhos, sem `section`).
 */
export const HeroSection = () => {
  const { isDesktop } = useDevice();

  return (
    <div
      className={`${styles.hero} vtex-render__container-id-block-franqueado-01`}
    >
      <div
        className="vtex-flex-layout-0-x-flexRow vtex-flex-layout-0-x-flexRow--lp-franqueado-top-banner"
        aria-label="Seja um franqueado"
      >
        <div className="vtex-flex-layout-0-x-flexRowContent vtex-flex-layout-0-x-flexRowContent--lp-franqueado-top-banner">
          <div className="vtex-flex-layout-0-x-flexCol vtex-flex-layout-0-x-flexCol--block-franqueado-01">
            <div className="vtex-flex-layout-0-x-flexColChild vtex-flex-layout-0-x-flexColChild--block-franqueado-01">
              <img
                src={isDesktop ? HERO_IMAGES.desktop : HERO_IMAGES.mobile}
                alt="banner-levis"
                loading="eager"
                className="vtex-store-components-3-x-imageElement"
              />
            </div>

            <div className="vtex-flex-layout-0-x-flexColChild vtex-flex-layout-0-x-flexColChild--block-franqueado-01">
              <FranqueadoForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
