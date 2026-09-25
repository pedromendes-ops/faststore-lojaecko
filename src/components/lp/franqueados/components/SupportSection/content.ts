// Áreas de suporte. Copy conforme o Figma (node 3347:11786), que difere inteira
// da versão anterior. O Figma quebra alguns destes textos em vários parágrafos,
// mas são quebras manuais da caixa de texto do design (a linha morre no meio);
// aqui viram um parágrafo só, que reflui no browser.
export const SUPORTE_CARDS: { title: string; icon: string; text: string }[] = [
  {
    title: "COMERCIAL",
    icon: "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/a528166b-aadf-4813-9f44-72a762c72640___3e4df0e9c8348304de5af44531c1513f.png",
    text: "Atuando como a ponte entre as áreas internas da Levi’s® e os grupos franqueados. Nosso papel é conectar as necessidades dos consumidores aos produtos e serviços oferecidos, garantindo alinhamento estratégico. Oferece orientação contínua aos franqueados, sempre com foco em padronização, inovação e rentabilidade do negócio.",
  },
  {
    title: "BRAND EXPERIENCE",
    icon: "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/359647b7-0411-462e-a678-8cc6b2826d6d___58a2da41747c6e3bc143862bcd4804b6.png",
    text: "O time de BX desenvolve e implementa campanhas sazonais no ponto de venda, alinhadas ao calendário de comunicação e às ações comerciais da marca. Além disso, orienta e treina os franqueados, assegurando a aplicação das diretrizes globais de visual merchandising. Com isso, garantimos que cada consumidor viva uma experiência de compra unificada, consistente e autêntica em todas as lojas Levi’s®.",
  },
  {
    title: "FINANCEIRO",
    icon: "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/b17cba7b-f5fb-4f5a-afcb-12726b456b23___2de56e7078f3d3033b40470d2807f7bb.png",
    text: "O time financeiro acompanha todos os pagamentos das mercadorias enviadas aos franqueados, garantindo transparência e segurança. Também apoia o time comercial por meio de análises financeiras, concessão de descontos, cálculos de margem de produtos e definição de prazos de pagamento — sempre com foco na saúde do negócio.",
  },
  {
    title: "LOGÍSTICA",
    icon: "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/e1b6c222-e627-4b81-8326-3782b05272fc___1361ee4ea592810dab15fe349529d8a7.png",
    text: "Nosso Centro de Distribuição é responsável por armazenar os produtos, separar os pedidos de alocação feitos pelo Customer Service, faturar e expedir os itens aos franqueados. Tudo isso com processos ágeis e eficientes, assegurando que cada loja Levi’s® receba seus produtos no tempo certo e com a qualidade que representa a marca.",
  },
  {
    title: "PRODUTO",
    icon: "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/7feee5c7-b086-4696-be1b-e2fa730fba74___dd3d0e8f2eb7b270e876c35b7165af98.png",
    text: "O time de produto planeja, a cada semestre, as coleções que serão comercializadas no Brasil. A seleção das peças começa com quase um ano de antecedência para garantir sempre o melhor mix de produtos para o mercado nacional. Além disso, apoia o time comercial na apresentação das coleções aos franqueados, assegurando clareza e alinhamento estratégico.",
  },
  {
    title: "ALOCAÇÃO",
    icon: "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/8658b73e-8dc3-4ae8-8d7f-92562b036f9e___871884758c3c7e4bf64cb1a6d1976db3.png",
    text: "Em conjunto com o time comercial, o time de Alocação realiza semanalmente a distribuição dos produtos na carteira de cada franqueado. Também atua como ponte de comunicação com o Centro de Distribuição e com o Financeiro, quando necessário, garantindo fluidez e eficiência em todo o processo.",
  },
  {
    title: "MARKETING",
    icon: "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/cb61a72a-2f9d-44b9-a3d1-fe05edaf8d17___a6b7339e4a111cd9ebf875f48870690b.png",
    text: "Nosso marketing é guiado pela força da marca e pelo poder de inspirar. Nosso objetivo é garantir que cada produto seja percebido no mercado como a melhor expressão da Levi’s®, com campanhas e comunicações de alto impacto que refletem nossos valores e cultura. Alinhado à estratégia global, o time desenvolve planejamentos e materiais adaptados à nossa região, apoiando lojas físicas e operações para entregar uma experiência de consumo única e consistente.",
  },
];

export const SUPPORT_SIDE_IMAGES = [
  "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/643fdc43-b719-4848-a12b-97b985434228___5721dd431854674e8a9781e4115f3fc6.png",
  "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/435f6fd0-f5d4-461d-acc0-8d44dbc06505___aedb3db9b41270d7a022c843af88e2d7.png",
];

/** O card de MARKETING ocupa a linha inteira no grid do Figma. */
export const WIDE_SUPPORT_CARD = "MARKETING";
