import { useDevice } from "../../../../hooks/useDevice";
import { SVG_CARD_09_NEW, SVG_CARD_MOBILE } from "../../svgs";
import { RawSvg } from "../RawSvg";
import { SectionShell } from "../SectionShell";
import { INVESTIMENTO_ROWS, INVESTMENT_BANNER } from "./content";
import styles from "./styles.module.scss";

/**
 * BLOCO 09 — investimento (foto de fundo + 5 cards de estatística).
 * O card tem marcação própria (pílula do título sobre a faixa), por isso não
 * usa o `IntersectCard` dos blocos 04/06/07.
 */
export const InvestmentSection = () => {
  const { isDesktop } = useDevice();

  return (
    <SectionShell id="09" className={styles.section}>
      <div className="lojalevis-store-2-x-block-franqueado-09-container">
        <div className="lojalevis-store-2-x-block-franqueado-09-content-image">
          <img
            src={INVESTMENT_BANNER}
            alt=""
            loading="lazy"
            className="vtex-store-components-3-x-imageElement"
          />
        </div>

        <div className="lojalevis-store-2-x-block-franqueado-09-content">
          <div className="lojalevis-store-2-x-block-franqueado-09-content-title">
            <div className="vtex-rich-text-0-x-container vtex-rich-text-0-x-container--block-franqueado-09-content-title">
              <h3 className="vtex-rich-text-0-x-heading vtex-rich-text-0-x-heading--block-franqueado-09-content-title">
                Investimento
              </h3>
              <p className="lh-copy vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--block-franqueado-09-content-title">
                A partir de R$ 1.000.000 para uma loja de 80 a 100m² (com
                estoque inicial).
              </p>
            </div>
          </div>

          <div className="lojalevis-store-2-x-block-franqueado-09-content-container-cards">
            {INVESTIMENTO_ROWS.map((column, columnIndex) => (
              <div
                key={columnIndex}
                className="lojalevis-store-2-x-block-franqueado-09-content-container-card-container"
              >
                {column.map((card) => (
                  <div
                    key={card.title}
                    className="lojalevis-store-2-x-block-franqueado-07-card-intersect"
                  >
                    <div className="vtex-rich-text-0-x-container vtex-rich-text-0-x-container--block-franqueado-09-card-intersect--card-title">
                      <p className="vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--block-franqueado-09-card-intersect--card-title">
                        {card.title}
                      </p>
                    </div>

                    <RawSvg
                      svg={isDesktop ? SVG_CARD_09_NEW : SVG_CARD_MOBILE}
                      className="franqShape"
                    />

                    <div className="vtex-rich-text-0-x-container vtex-rich-text-0-x-container--block-franqueado-09-card-intersect">
                      <p className="vtex-rich-text-0-x-paragraph vtex-rich-text-0-x-paragraph--block-franqueado-09-card-intersect">
                        {card.value}
                        {card.suffix ? (
                          <span className="vtex-rich-text-0-x-strong vtex-rich-text-0-x-strong--block-franqueado-09-card-intersect">
                            {" "}
                            {card.suffix}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
};

export default InvestmentSection;
