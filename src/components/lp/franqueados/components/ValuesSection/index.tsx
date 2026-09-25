import { SectionShell } from "../SectionShell";
import { VALUES } from "./content";
import styles from "./styles.module.scss";

/** BLOCO 05 — nossos valores (4 cards). */
export const ValuesSection = () => (
  <SectionShell id="05" className={styles.section}>
    <div className="vtex-rich-text-0-x-container vtex-rich-text-0-x-container--franqueado--title-red">
      <h3 className="vtex-rich-text-0-x-heading vtex-rich-text-0-x-heading--franqueado--title-red">
        NOSSOS VALORES
      </h3>
    </div>

    <div className="vtex-flex-layout-0-x-flexRowContent--block-franqueado-05-content-container-card">
      {VALUES.map((value) => (
        <div
          key={value.title}
          className="vtex-rich-text-0-x-container vtex-rich-text-0-x-container--franqueado--text lojalevis-store-2-x-block-franqueado-05-content-card"
        >
          <p className="lh-copy vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--franqueado--text">
            <span className="b vtex-rich-text-0-x-strong vtex-rich-text-0-x-strong--franqueado--text">
              {value.title}
            </span>
          </p>
          <p className="lh-copy vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--franqueado--text">
            {value.text}
          </p>
        </div>
      ))}
    </div>
  </SectionShell>
);

export default ValuesSection;
