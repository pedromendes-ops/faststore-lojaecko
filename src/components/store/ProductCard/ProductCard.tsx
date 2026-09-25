'use client'

import { useState } from 'react'
import NextLink from 'next/link'
import { useProductLink } from 'src/sdk/product/useProductLink'
import QuickView from '../QuickView'
import ProductPrice from '../ProductPrice'
import ProductCluster from '../ProductCluster'
import { SwiperCarousel } from '../../ui/SwiperCarousel'
import type { ProductCardProps } from './types'
import { getProductDiscount } from '../../../utils/productPrice'
import { resizeVtexImage } from '../../../utils/productImage'
import { getMaxInterestFreeInstallment } from '../Installments/utils'

import {
  IMG_SHELF_LAYOUT,
  HAS_QUICKVIEW,
  DISCOUNT_PERCENTAGE,
  IMG_SHELF_WIDTH
} from '../../../constants/store'

import styles from './ProductCard.module.scss'

export function ProductCard({
  product,
  index = 0,
  variant = 'default',

}: ProductCardProps) {
  
  const { href: productHref, onClick: onProductClick } = useProductLink({
    product,
    selectedOffer: 0,
    index,
  })
  console.log('product', product)

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const productName = product.isVariantOf?.name ?? product.name
  const productBrand = product.brand?.name ?? ''
  const images = product.image ?? []
  const mainImage = images[0]
  const secondaryImage = images[1]
  const offer = product.offers?.offers?.[0]
  const price = offer?.price ?? product.offers?.lowPrice
  const listPrice = offer?.listPrice
  const maxInstallment = getMaxInterestFreeInstallment(product.availableInstallments ?? [])
  const {hasDiscount, discountPercentage} = getProductDiscount(price, listPrice)

  // RENDER IMAAGES
  const ContentImage = () => {
    if (!mainImage?.url) {
      return null
    }

    //tipo slider
    if (IMG_SHELF_LAYOUT === 'slider') {
      return (
        <SwiperCarousel
          slidesPerView={1}
          spaceBetween={0}
          showArrows={images.length > 1}
          showDots={false}
          loop={images.length > 1}
          autoPlay={false}
        >
          {images.map((image, imageIndex) => {
            if (!image?.url) {
              return null
            }            
            return (
              <img
                key={`${image.url}-${imageIndex}`}
                src={resizeVtexImage(image.url,IMG_SHELF_WIDTH)}
                alt={image.alternateName ?? `${productName} - ${imageIndex + 1}`}
                width={500}
                height={500}
                loading="lazy"
                decoding="async"
                className={styles.image}
              />
            )
          })}
        </SwiperCarousel>
      )
    }

    // tipo hover
    if (IMG_SHELF_LAYOUT === 'hover') {
      return (
        
        <div className={styles.hoverImages}>
          <img
            src={resizeVtexImage(mainImage.url, IMG_SHELF_WIDTH)}
            alt={mainImage.alternateName ?? productName}
            width={500}
            height={500}
            loading="lazy"
            decoding="async"
            className={styles.image}
          />

          {secondaryImage?.url && (
            <img
              src={resizeVtexImage(secondaryImage.url, IMG_SHELF_WIDTH)}
              alt={secondaryImage.alternateName ?? productName}
              width={500}
              height={500}
              loading="lazy"
              decoding="async"
              className={styles.imageHover}
            />
          )}
        </div>
      )
    }

    // tipo default
    return (
      <img
        src={resizeVtexImage(mainImage.url, IMG_SHELF_WIDTH)}
        alt={mainImage.alternateName ?? productName}
        width={500}
        height={500}
        loading="lazy"
        decoding="async"
        className={styles.image}
      />
    )
  }

  return (
    <>
      <article
        className={styles.productCard}
        data-variant={variant}
        data-product-index={index}
        data-image-layout={IMG_SHELF_LAYOUT}
      >
        <NextLink
          href={productHref}
          onClick={onProductClick}
          className={styles.link}
        >
          {/* image */}
          <div className={styles.imageWrapper}>
            {DISCOUNT_PERCENTAGE && hasDiscount && (
              <span className={styles.discountPercentage}>
                {discountPercentage} % OFF
              </span>
            )}
            <div className={styles.shelfCluster}>
              <ProductCluster
                clusters={product.productClusters}
              />
            </div>
            <ContentImage />
          </div>

          <div className={styles.content}>

            {/* brand */}
            {productBrand && (
              <div className={styles.productBrand}>{productBrand}</div>
            )}
            {/* name */}
            <h3 className={styles.productName}>{productName}</h3>

            {/* prices */}
            {typeof price === 'number' && (
              <ProductPrice
                variant="product-card"
                price={price}
                listPrice={listPrice}
                installment={maxInstallment}
              />
            )}
          </div>
        </NextLink>
        
        {/* quickview */}
        {HAS_QUICKVIEW && (
          <button
            type="button"
            className={styles.quickViewButton}
            aria-label={`Espiar ${productName}`}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              setIsQuickViewOpen(true)
            }}
          >
            Espiar
          </button>
        )}
      </article>

      {HAS_QUICKVIEW && (
        <QuickView
          isOpen={isQuickViewOpen}
          onClose={() =>
            setIsQuickViewOpen(false)
          }
          product={{
            id: product.id,
            name: productName,
            slug: product.slug,
          }}
        />
      )}
    </>
  )
}

export default ProductCard