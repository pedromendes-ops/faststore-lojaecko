import { SectionShell } from "../SectionShell";
import { PERFIL_FRANQUEADO, PROFILE_IMAGE } from "./content";
import styles from "./styles.module.scss";

/** BLOCO 12 — perfil do franqueado (foto à esquerda + pílulas à direita). */
export const ProfileSection = () => (
  <SectionShell id="12" className={styles.section}>
    <div className="lojalevis-store-2-x-block-franqueado-12-container">
      <div className="lojalevis-store-2-x-block-franqueado-12-content--image">
        <img
          src={PROFILE_IMAGE}
          alt=""
          loading="lazy"
          className="vtex-store-components-3-x-imageElement vtex-store-components-3-x-imageElement--block-franqueado-12-image"
        />
      </div>

      <div className="lojalevis-store-2-x-block-franqueado-12-content--text">
        <p className="vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--block-franqueado-12-title">
          Perfil do franqueado
        </p>

        <div className="lojalevis-store-2-x-block-franqueado-12-content--cards">
          {PERFIL_FRANQUEADO.map((item) => (
            <div
              key={item}
              className="lojalevis-store-2-x-block-franqueado-12-card"
            >
              <p
                className="vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--block-franqueado-12-card-text"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  </SectionShell>
);

export default ProfileSection;
