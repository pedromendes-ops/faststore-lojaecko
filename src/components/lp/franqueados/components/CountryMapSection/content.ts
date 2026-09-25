// Mapas exportados do Figma e commitados. `mundi` é o mapa-múndi cinza de
// fundo (1440x882); `brasil` é o país em vermelho com os pinos (626x641).
// ATENÇÃO: os arquivos têm nomes trocados no VTEX — `background-image-maps-desk.png`
// é o MUNDO e `maps-lp-franqueado.png` é o BRASIL. Mantidos os mapeamentos
// corretos por conteúdo, não pelo nome.
export const MAPS = {
  mundi: "https://lojalevis.vtexassets.com/arquivos/background-image-maps-desk.png",
  brasil: "https://lojalevis.vtexassets.com/arquivos/maps-lp-franqueado.png",
  // Versão mobile do mapa do Brasil: recorte próprio (356x411, mais alto que o
  // desktop), com os pinos reposicionados para a coluna estreita. O desktop
  // espremido em 300px ficava achatado.
  brasilMobile: "https://lojalevis.vtexassets.com/arquivos/image-maps-mobile.png",
};

// Números conforme o Figma (node 3347:13966), que somam 87 e batem com a faixa
// de total do próprio design. A versão anterior trazia 9/11/4/54/23 (=101).
export const REGIONS = [
  { value: "9", label: "Região Centro-Oeste" },
  { value: "11", label: "Região Nordeste" },
  { value: "4", label: "Região Norte" },
  { value: "54", label: "Região Sudeste" },
  { value: "23", label: "Região Sul" },
];

export const REGIONS_TOTAL = { value: "101", label: "Lojas Levi’s atualmente" };
