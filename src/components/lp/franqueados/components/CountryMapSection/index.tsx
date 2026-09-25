import { useDevice } from "../../../../hooks/useDevice";
import { SVG_MAP, SVG_MAP_MOBILE } from "../../svgs";
import { RawSvg } from "../RawSvg";
import { SectionShell } from "../SectionShell";
import { MAPS, REGIONS, REGIONS_TOTAL } from "./content";
import styles from "./styles.module.scss";

type RegionProps = { value: string; label: string };

// número + rótulo, usado tanto na lista de regiões quanto na faixa do total
const Region = ({ value, label }: RegionProps) => (
  <div className="lojalevis-store-2-x-block-franqueado-11-region">
    <p className="vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--block-franqueado-11-region-value">
      {value}
    </p>
    <p className="vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--block-franqueado-11-region-label">
      {label}
    </p>
  </div>
);

/** BLOCO 11 — estamos em todo o país (mapa + lojas por região). */
export const CountryMapSection = () => {
  const { isDesktop } = useDevice();

  return (
    <SectionShell id="11" className={styles.section}>
      <div className="lojalevis-store-2-x-block-franqueado-11-container">
        <img
          src={MAPS.mundi}
          alt=""
          loading="lazy"
          aria-hidden="true"
          className="lojalevis-store-2-x-block-franqueado-11-map--world"
        />
        <img
          src={MAPS.brasil}
          alt="Mapa do Brasil com as lojas Levi’s® por região"
          loading="lazy"
          className="lojalevis-store-2-x-block-franqueado-11-map--brazil"
        />
        <img
          src={MAPS.brasilMobile}
          alt="Mapa do Brasil com as lojas Levi’s® por região"
          loading="lazy"
          className="lojalevis-store-2-x-block-franqueado-11-map--brazil-mobile"
        />

        <div className="vtex-rich-text-0-x-container vtex-rich-text-0-x-container--block-franqueado-11-container-left-title">
          <h3 className="vtex-rich-text-0-x-heading vtex-rich-text-0-x-heading--block-franqueado-11-title">
            Estamos em
            <br />
            todo o país
          </h3>
        </div>

        <p className="vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--block-franqueado-11-subtitle">
          Lojas por região
        </p>

        <div className="lojalevis-store-2-x-block-franqueado-11-regions">
          {REGIONS.map((region) => (
            <Region key={region.label} {...region} />
          ))}
        </div>

        <div className="lojalevis-store-2-x-block-franqueado-11-total">
          <RawSvg
            svg={isDesktop ? SVG_MAP : SVG_MAP_MOBILE}
            className="franqShape"
          />
          <Region {...REGIONS_TOTAL} />
        </div>
      </div>
    </SectionShell>
  );
};

export default CountryMapSection;
