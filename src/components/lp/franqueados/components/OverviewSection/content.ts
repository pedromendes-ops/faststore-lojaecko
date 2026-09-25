import {
  SVG_OVERVIEW_CRESCIMENTO,
  SVG_OVERVIEW_DIGITAL,
  SVG_OVERVIEW_ESTADOS,
  SVG_OVERVIEW_MULTIMARCAS,
  SVG_OVERVIEW_PUBLICO,
} from "../../svgs";

// Bloco 13: o Figma empilha duas fotos (ambas com canal alpha) sobre um fundo
// #1e191b, e só então aplica o véu de 50%. Mantidas as duas.
export const OVERVIEW_BACKGROUNDS = [
  "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/f0f3243f-b30c-408e-b259-5a7bd71c2b99___eb78f073f7355085f48f2719fd07cdc6.png",
  "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/3c69c77c-4700-41b5-9d87-f3f89298ffda___b34d94c07b8a76db4a1d987984c0aab7.png",
];

// Conteúdo do Figma (node 3406:16404). Cada ícone tem tamanho próprio no
// design, por isso vem junto do item.
export const OVERVIEW_CARDS: {
  icon: string;
  iconWidth: number;
  iconHeight: number;
  text: string;
  textWidth?: number;
}[] = [
  {
    icon: SVG_OVERVIEW_PUBLICO,
    iconWidth: 48,
    iconHeight: 48,
    text: "Público: A/B1",
  },
  {
    icon: SVG_OVERVIEW_ESTADOS,
    iconWidth: 50,
    iconHeight: 52,
    text: "Presença em todos os estados brasileiros",
    textWidth: 117,
  },
  {
    icon: SVG_OVERVIEW_MULTIMARCAS,
    iconWidth: 50,
    iconHeight: 50,
    text: "Mais de 1000 multimarcas",
    textWidth: 103,
  },
  {
    icon: SVG_OVERVIEW_DIGITAL,
    iconWidth: 42,
    iconHeight: 31,
    text: "20% de penetração digital 2022e",
    textWidth: 107,
  },
  {
    icon: SVG_OVERVIEW_CRESCIMENTO,
    iconWidth: 38,
    iconHeight: 38,
    text: "+20% de crescimento em receita líquida nos últimos anos",
    textWidth: 109,
  },
];
