export const orderTextStyles = {
  left: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateAreas: '"content image"',
  },
  right: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateAreas: '"image content"',
  },
  top: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateAreas: `
      "content"
      "image"
    `,
  },
  bottom: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateAreas: `
      "image"
      "content"
    `,
  },
} as const