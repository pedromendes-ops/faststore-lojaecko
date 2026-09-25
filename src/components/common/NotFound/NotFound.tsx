import type { PropsWithChildren } from 'react'

import styles from './NotFound.module.scss'

type NotFoundProps = {
  /** CMS-editable headline (comes from the 404 content type). */
  title?: string
}

/** Branded, on-brand headline shown unless the merchant sets a custom one. */
const BRAND_HEADLINE = 'Essa página saiu de moda'

/**
 * Levi's 404 — clean, editorial layout (Apple-like whitespace) with the
 * brand's colors: red as the single accent, indigo for text, and a discreet
 * golden "stitch" as the only ornament.
 *
 * Replaces the inner `EmptyState` slot of the native EmptyState section
 * (wired in `src/components/overrides/EmptyState.tsx`). The 404 route renders
 * the EmptyState section from CMS content, so `title` (and any CMS subtitle
 * passed as children) stay editable while the layout is fully custom here.
 *
 * No `@faststore/ui` primitives are used on purpose: the design is fully
 * bespoke, so native elements + a scoped SCSS module avoid `[data-fs-*]`
 * specificity fights.
 */
function NotFound({ title, children }: PropsWithChildren<NotFoundProps>) {
  // Prefer the branded copy by default. The 404 CMS content ships with the
  // generic framework title ("Not Found: 404!"); only a real, custom title set
  // in Admin → Content should override the brand voice.
  const headline =
    title && title.trim() && !/not\s*found/i.test(title)
      ? title
      : BRAND_HEADLINE

  return (
    <section className={styles.wrapper} aria-labelledby="notfound-title">
      <div className={styles.card}>
        {/* Discreet Levi's arcuate stitch, drawn on load (stroke-dasharray) */}
        <svg
          className={styles.stitch}
          viewBox="0 0 240 40"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M6 30 C 70 6, 170 6, 234 30" />
        </svg>

        <p className={styles.eyebrow}>Erro 404</p>

        <h1 id="notfound-title" className={styles.title}>
          {headline}
        </h1>

        <p className={styles.subtitle}>
          Não encontramos esta página. Talvez o modelo tenha sido descontinuado
          ou o endereço tenha mudado.
        </p>

        <a className={styles.cta} href="/">
          Voltar para a home
        </a>

        <nav className={styles.suggestions} aria-label="Categorias populares">
          <span className={styles.suggestionsLabel}>Ou explore</span>
          <ul>
            <li>
              <a href="/s?q=jeans">Jeans</a>
            </li>
            <li>
              <a href="/s?q=jaqueta">Jaquetas</a>
            </li>
            <li>
              <a href="/s?q=camiseta">Camisetas</a>
            </li>
            <li>
              <a href="/s?q=501">501®</a>
            </li>
          </ul>
        </nav>

        {/* CMS subtitle / technical error details, kept very discreet */}
        {children && <div className={styles.meta}>{children}</div>}
      </div>
    </section>
  )
}

export default NotFound
