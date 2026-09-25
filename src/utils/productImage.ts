export function resizeVtexImage(
  url?: string,
  width?: number,
  height: number | 'auto' = 'auto'
): string {
  if (!url || !width) {
    return url ?? ''
  }

  return url.replace(
    /\/arquivos\/ids\/(\d+)(?:-\d+-(?:\d+|auto))?/,
    `/arquivos/ids/$1-${width}-${height}`
  )
}