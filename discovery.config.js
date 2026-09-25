
module.exports = {
  seo: {
  "title": "Levi's® Jeans - Loja oficial Levi's® Brasil - Levi's® Brasil",
  "description": "A loja oficial Levi's® Brasil tem a melhor seleção de jeans masculinos e femininos, acessórios e calçados. Shop the collection!",
  "titleTemplate": "%s - Levi's® Brasil",
  "author": "Levi's® Brasil",
},

  // Theming
  theme: 'custom-theme',

  // Ecommerce Platform
  platform: 'vtex',

  // Platform specific configs for API
  api: {
    storeId: process.env.NEXT_PUBLIC_STORE_ID || "lojalevis",
    workspace: 'master',
    environment: 'vtexcommercestable',
    hideUnavailableItems: true,
    // Let the skuLoader resolve out-of-stock SKUs (search `sku:` query runs with
    // hideUnavailableItems: false). Without it, `product(locator:[{key:'id'}])`
    // throws for unavailable products, so the Quick Buy modal hangs and the PDP
    // 500s. This only affects direct SKU lookups (PDP / Quick Buy / cart) —
    // listings still honor `hideUnavailableItems: true`.
    enableUnavailableItemsOnCart: true,
    incrementAddress: false,
  },

  // Default session
  session: {
    currency: {
      code: "BRL",
      symbol: "R$",
    },
    locale: "pt-BR",
    channel: '{"salesChannel":1,"regionId":""}',
    country: "BRA",
    deliveryMode: null,
    addressType: null,
    postalCode: null,
    geoCoordinates: null,
    person: null,
  },

  cart: {
    id: '',
    items: [],
    messages: [],
    shouldSplitItem: true,
  },

  // Production URLs
  //storeUrl: "https://lojalevis.vtex.app",
  storeUrl: "https://www.levi.com.br",
  checkoutUrl: "https://www.levi.com.br/checkout",
  loginUrl: "https://www.levi.com.br/api/io/login",
  accountUrl: "https://www.levi.com.br/api/io/account",

  previewRedirects: {
    home: '/',
    plp: "/feminino",
    search: "/s?q=Levis",
    pdp: "/calca-jeans-levis-725-high-rise-bootcut-lavagem-media-187590235/p",
  },

  // Lighthouse CI
  lighthouse: {
    server: process.env.BASE_SITE_URL || 'http://localhost:3000',
    pages: {
      home: '/',
      pdp: "/calca-jeans-levis-725-high-rise-bootcut-lavagem-media-187590235/p",
      collection: "/feminino",
    },
  },

  // E2E CI
  cypress: {
    pages: {
      home: '/',
      pdp: "/calca-jeans-levis-725-high-rise-bootcut-lavagem-media-187590235/p",
      collection: "/feminino",
      collection_filtered: "/feminino/?category-1=feminino&brand=Levis&facets=category-1%2Cbrand%27",
      search: "/s?q=Levis",
    },
    browser: 'electron',
  },

  analytics: {
    // https://developers.google.com/tag-platform/tag-manager/web#standard_web_page_installation,
    gtmContainerId: null,
  },

  experimental: {
    nodeVersion: 18,
    cypressVersion: 12,
  },


  contentSource: {
    type: 'CP',
    project: "faststore",
  },
}
