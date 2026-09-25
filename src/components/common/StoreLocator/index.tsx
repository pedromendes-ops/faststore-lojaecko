import { useMemo, useState } from 'react'
import { Modal } from '@faststore/ui'

import styles from './StoreLocator.module.scss'
import type { StoreItem, StoreLocatorProps } from './types'

const safeNumber = (
  value: string | number | undefined,
  fallback: number,
  min = 0
) => {
  const number = Number(value)

  return Number.isFinite(number) && number >= min ? number : fallback
}

// Remove acentos e padroniza o texto para melhorar a busca.
const normalizeText = (value?: string) => {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

const getStoreAddress = (store: StoreItem) => {
  const firstLine = [
    store.address,
    store.number,
    store.complement,
  ]
    .filter(Boolean)
    .join(', ')

  const secondLine = [
    store.neighborhood,
    store.city,
    store.state,
  ]
    .filter(Boolean)
    .join(' - ')

  return [firstLine, secondLine, store.postalCode]
    .filter(Boolean)
    .join(', ')
}

const getStoreSearchText = (store: StoreItem) => {
  return normalizeText(
    [
      store.name,
      store.address,
      store.number,
      store.complement,
      store.neighborhood,
      store.city,
      store.state,
      store.postalCode,
      store.phone,
    ]
      .filter(Boolean)
      .join(' ')
  )
}

const getMapUrl = (store: StoreItem) => {
  if (store.mapEmbedUrl?.trim()) {
    return store.mapEmbedUrl.trim()
  }

  const query = [
    store.name,
    getStoreAddress(store),
  ]
    .filter(Boolean)
    .join(', ')

  return `https://www.google.com/maps?q=${encodeURIComponent(
    query
  )}&output=embed`
}

const getPhoneHref = (phone?: string) => {
  if (!phone) return undefined

  const normalizedPhone = phone.replace(/\D/g, '')

  if (!normalizedPhone) return undefined

  return `tel:+55${normalizedPhone}`
}

const StoreCard = ({
  store,
  mapButtonText,
  onOpenMap,
}: {
  store: StoreItem
  mapButtonText: string
  onOpenMap: (store: StoreItem) => void
}) => {
  const phoneHref = getPhoneHref(store.phone)

  return (
    <article className={styles.storeCard}>
      {store.name && (
        <h2 className={styles.storeName}>{store.name}</h2>
      )}

      <div className={styles.storeInformation}>
        <div className={styles.informationColumn}>
          <h3 className={styles.informationTitle}>Endereço:</h3>

          <address className={styles.address}>
            {store.address && (
              <span>
                {store.address}
                {store.number ? `, ${store.number}` : ''}
              </span>
            )}

            {store.complement && <span>{store.complement}</span>}

            {store.neighborhood && (
              <span>{store.neighborhood}</span>
            )}

            {store.postalCode && (
              <span>CEP: {store.postalCode}</span>
            )}
          </address>
        </div>

        <div className={styles.informationColumn}>
          <h3 className={styles.informationTitle}>Contato:</h3>

          {store.phone &&
            (phoneHref ? (
              <a
                href={phoneHref}
                className={styles.phone}
                aria-label={`Ligar para ${store.name ?? 'a loja'} no telefone ${
                  store.phone
                }`}
              >
                {store.phone}
              </a>
            ) : (
              <span className={styles.phone}>{store.phone}</span>
            ))}
        </div>
      </div>

      <div className={styles.storeFooter}>
        <p className={styles.location}>
          {[store.city, store.state].filter(Boolean).join(' - ')}
        </p>

        <button
          type="button"
          className={styles.mapButton}
          onClick={() => onOpenMap(store)}
          aria-label={`${mapButtonText} de ${store.name ?? 'loja'}`}
        >
          {mapButtonText}
        </button>
      </div>
    </article>
  )
}

export const StoreLocator = ({
  title = 'Nossas Lojas',
  subtitle = 'Encontre a loja mais perto de você',
  searchLabel = 'Digite na busca o nome da loja, shopping, bairro, cidade, estado ou CEP:',
  searchPlaceholder = 'Encontre uma loja...',

  mapButtonText = 'Ver mapa',
  emptyText = 'Nenhuma loja encontrada.',
  areaSection = 'container',
  

  columnsDesktop = '4',
  columnsTablet = '2',
  columnsPhone = '1',
  stores = [],

}: StoreLocatorProps) => {
  const [search, setSearch] = useState('')
  const [selectedStore, setSelectedStore] =
    useState<StoreItem | null>(null)

  const activeStores = useMemo(
    () => stores.filter((store) => store.active !== false),
    [stores]
  )

  const filteredStores = useMemo(() => {
    const normalizedSearch = normalizeText(search)

    if (!normalizedSearch) {
      return activeStores
    }

    return activeStores.filter((store) =>
      getStoreSearchText(store).includes(normalizedSearch)
    )
  }, [activeStores, search])

  const handleOpenMap = (store: StoreItem) => {
    setSelectedStore(store)
  }

  const handleCloseMap = () => {
    setSelectedStore(null)
  }

  const content = (
    <div
      className={`${styles.content}`}
      style={
        {
          '--store-columns-desktop': safeNumber(
            columnsDesktop,
            4,
            1
          ),

          '--store-columns-tablet': safeNumber(
            columnsTablet,
            2,
            1
          ),

          '--store-columns-phone': safeNumber(
            columnsPhone,
            1,
            1
          ),
        } as React.CSSProperties
      }
    >
      <header className={styles.header}>
        {title && <h1 className={styles.title}>{title}</h1>}

        {subtitle && (
          <p className={styles.subtitle}>{subtitle}</p>
        )}
      </header>

      <div className={styles.searchArea}>
        {searchLabel && (
          <label
            htmlFor="store-locator-search"
            className={styles.searchLabel}
          >
            {searchLabel}
          </label>
        )}

        <div className={styles.searchWrapper}>
          <input
            id="store-locator-search"
            type="search"
            value={search}
            placeholder={searchPlaceholder}
            className={styles.searchInput}
            onChange={(event) => setSearch(event.target.value)}
            autoComplete="off"
          />

          <span
            className={styles.searchIcon}
            aria-hidden="true"
          >
            ⌕
          </span>
        </div>

        <p className={styles.resultCount} aria-live="polite">
          {filteredStores.length}{' '}
          {filteredStores.length === 1
            ? 'loja encontrada'
            : 'lojas encontradas'}
        </p>
      </div>

      {filteredStores.length > 0 ? (
        <div className={styles.storeGrid}>
          {filteredStores.map((store, index) => (
            <StoreCard
              key={store.id || `${store.name}-${index}`}
              store={store}
              mapButtonText={mapButtonText}
              onOpenMap={handleOpenMap}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty} role="status">
          {emptyText}
        </div>
      )}

      <Modal
        isOpen={Boolean(selectedStore)}
        onDismiss={handleCloseMap}
        className={styles.modal}
        overlayProps={{
          className: styles.overlay,
        }}
        aria-labelledby="store-map-title"
      >
        {selectedStore && (
          <div className={styles.modalContent}>
            <header className={styles.modalHeader}>
              <h2
                id="store-map-title"
                className={styles.modalTitle}
              >
                {selectedStore.name}
              </h2>

              <button
                type="button"
                className={styles.closeButton}
                onClick={handleCloseMap}
                aria-label='Fechar mapa'
              >
                ×
              </button>
            </header>

            <div className={styles.mapContainer}>
              <iframe
                src={getMapUrl(selectedStore)}
                title={`Mapa da loja ${
                  selectedStore.name ?? ''
                }`}
                className={styles.mapIframe}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <footer className={styles.modalFooter}>
              <address>
                {getStoreAddress(selectedStore)}
              </address>
            </footer>
          </div>
        )}
      </Modal>
    </div>
  )

  return (
    <section
      aria-label='Localizador de lojas'
    >
      {areaSection === 'container' ? (
        <div className="wrap">
          <div className="container">{content}</div>
        </div>
      ) : (
        <div className="wrap">{content}</div>
      )}
    </section>
  )
}

export default StoreLocator