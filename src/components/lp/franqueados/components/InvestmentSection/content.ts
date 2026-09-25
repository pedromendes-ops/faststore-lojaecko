export const INVESTMENT_BANNER =
  "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/308d1c10-6b70-4bf1-a2ec-15cacc768cd4___cf26bd0c402d304323759256fd787876.png";

export type InvestmentCard = {
  value: string;
  suffix?: string;
  title: string;
};

// Cada array é uma COLUNA do Figma: no desktop elas ficam lado a lado e
// escalonadas (a segunda desce 64px); no mobile viram uma coluna só,
// intercalando as duas — o que o CSS resolve via `order`.
// O sufixo existe porque o Figma põe o "a.a" num corpo menor que o valor.
export const INVESTIMENTO_ROWS: InvestmentCard[][] = [
  [
    { value: "R$60.000,00", title: "Taxa de franquia" },
    { value: "2%", title: "Taxa de propaganda" },
    { value: "36 meses", title: "Prazo de retorno" },
  ],
  [
    { value: "2%", title: "Royalties" },
    { value: "R$3.000.000", suffix: "a.a", title: "Faturamento médio" },
  ],
];
