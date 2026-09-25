import { CountryMapSection } from "./components/CountryMapSection";
import { DifferentialsSection } from "./components/DifferentialsSection";
import { ExpansionSection } from "./components/ExpansionSection";
import { GallerySection } from "./components/GallerySection";
import { HeroSection } from "./components/HeroSection";
import { InvestmentSection } from "./components/InvestmentSection";
import { OverviewSection } from "./components/OverviewSection";
import { ProfileSection } from "./components/ProfileSection";
import { SupportSection } from "./components/SupportSection";
import { SustainabilitySection } from "./components/SustainabilitySection";
import { TextImageSection } from "./components/TextImageSection";
import { BLOCK02, BLOCK03 } from "./components/TextImageSection/content";
import { ValuesSection } from "./components/ValuesSection";
import styles from "./styles.module.scss";

/**
 * Landing page "Seja um franqueado" (lp-franqueado).
 *
 * Port da LP legada (VTEX Store Framework) para FastStore. Mantemos os handles
 * ORIGINAIS da VTEX IO no markup (lojalevis-store-2-x-*, vtex-rich-text-0-x-*,
 * vtex-store-components-3-x-*) e escrevemos o CSS mirando esses handles,
 * escopado via :global(...) dentro do módulo de cada bloco.
 *
 * Este arquivo é só a composição: cada bloco vive em `components/<Bloco>/`,
 * com a marcação, o conteúdo editorial e a folha de estilo próprios. O que
 * repetia entre blocos virou `SectionShell` (a casca), `IntersectCard` (a
 * faixa angular) e `RawSvg`; o formulário virou `useFranqueadoForm`.
 *
 * O conteúdo editorial (textos/imagens da marca) é fixo — o schema CMS
 * (cms_component__franqueados.jsonc) não expõe propriedades.
 */
export const Franqueados = () => (
  <div className={styles.franqueados}>
    <HeroSection />

    <TextImageSection
      variant="02"
      title={BLOCK02.title}
      paragraphs={BLOCK02.paragraphs}
      image={BLOCK02.image}
      titleClassName="vtex-rich-text-0-x-container--franqueado-02--title-red"
    />

    <TextImageSection
      variant="03"
      title={BLOCK03.title}
      paragraphs={BLOCK03.paragraphs}
      image={BLOCK03.image}
    />

    <GallerySection />
    <ValuesSection />
    <SustainabilitySection />
    <DifferentialsSection />
    <ExpansionSection />
    <InvestmentSection />
    <SupportSection />
    <CountryMapSection />
    <ProfileSection />
    <OverviewSection />
  </div>
);

export default Franqueados;
