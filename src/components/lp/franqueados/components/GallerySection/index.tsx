import { useDevice } from "../../../../hooks/useDevice";
import { SVG_CARD_04, SVG_CARD_MOBILE } from "../../svgs";
import { IntersectCard } from "../IntersectCard";
import { SectionShell } from "../SectionShell";
import { GALLERY_IMAGES, GALLERY_RIBBON } from "./content";
import styles from "./styles.module.scss";

/** BLOCO 04 — galeria de 3 imagens + faixa angular sobreposta. */
export const GallerySection = () => {
  const { isDesktop } = useDevice();

  return (
    <SectionShell id="04" className={styles.section}>
      <div className="lojalevis-store-2-x-block-franqueado-04-container">
        <div className="lojalevis-store-2-x-block-franqueado-04-images-container">
          {GALLERY_IMAGES.map((src, index) => (
            <img
              key={index}
              src={src}
              alt=""
              loading="lazy"
              className="vtex-store-components-3-x-imageElement vtex-store-components-3-x-imageElement--block-franqueado-04-image"
            />
          ))}
        </div>

        <IntersectCard
          svg={isDesktop ? SVG_CARD_04 : SVG_CARD_MOBILE}
          className="lojalevis-store-2-x-block-franqueado-04-card-intersect"
        >
          {GALLERY_RIBBON}
        </IntersectCard>
      </div>
    </SectionShell>
  );
};

export default GallerySection;
