'use client'

type EmptyGalleryProps = Record<
  string,
  unknown
>

export function EmptyGallery(
  props: EmptyGalleryProps
) {
  console.log(
    '[EmptyGallery props]',
    props
  )

  return (
    <div>
      <h2>
        Nenhum produto encontrado
      </h2>

      <p>
        Não encontramos produtos para
        esta seleção.
      </p>
    </div>
  )
}

export default EmptyGallery