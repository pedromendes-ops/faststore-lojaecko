export function toCssIdentifier(
  value?: string
): string {
    if (!value) {
        return ''
    }

    return value
        .normalize('NFD')
        .replace(
        /[\u0300-\u036f]/g,
        ''
        )
        .replace(/ç/g, 'c')
        .replace(/Ç/g, 'C')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}