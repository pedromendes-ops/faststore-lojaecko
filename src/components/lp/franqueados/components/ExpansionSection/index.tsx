import { SVG_WEDGE_08 } from "../../svgs";
import { RawSvg } from "../RawSvg";
import { SectionShell } from "../SectionShell";
import { EXPANSION_IMAGE, EXPANSION_PARAGRAPHS } from "./content";
import styles from "./styles.module.scss";

/** BLOCO 08 — foco da expansão (texto + foto + cunha diagonal de fundo). */
export const ExpansionSection = () => (
  <SectionShell id="08" className={styles.section}>
    <div className="lojalevis-store-2-x-block-franqueado-08-container">
      <RawSvg
        svg={SVG_WEDGE_08}
        className="lojalevis-store-2-x-block-franqueado-background-08-content--image"
      />

      <div className="lojalevis-store-2-x-block-franqueado-08-content--image">
        <img
          src={EXPANSION_IMAGE}
          alt=""
          loading="lazy"
          className="vtex-store-components-3-x-imageElement vtex-store-components-3-x-imageElement--block-franqueado-08-image"
        />
      </div>

      <div className="lojalevis-store-2-x-block-franqueado-08-content--text">
        <div className="vtex-rich-text-0-x-container vtex-rich-text-0-x-container--block-franqueado-08-title">
          <h3 className="vtex-rich-text-0-x-heading vtex-rich-text-0-x-heading--block-franqueado-08-title">
            Foco da
            <br />
            expansão
          </h3>
        </div>

        <div className="vtex-rich-text-0-x-container vtex-rich-text-0-x-container--block-franqueado-08-text">
          {EXPANSION_PARAGRAPHS.map((paragraph, index) => (
            <p
              key={index}
              className="lh-copy vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--block-franqueado-08-text"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  </SectionShell>
);

export default ExpansionSection;
