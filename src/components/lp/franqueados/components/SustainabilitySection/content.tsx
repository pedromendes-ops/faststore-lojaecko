import type { ReactNode } from "react";

const ICONS = {
  fibras:
    "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/9d7f73f2-dcba-4141-a61e-9dd615e6b1bd___11d2919b4ad4e1e9b5cfb41261a69bf4.png",
  algodao:
    "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/9b5dede6-b399-45a2-ad5a-f229883e08fa___e5cfd7d64df2687a2eaf0cb2f343c7b6.png",
  poliester:
    "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/2cd9e9a5-d0d3-4fe4-9081-aeb452666531___ea1558f0990f673bb5792b7f1797fb6b.png",
  madeira:
    "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/c1c01d49-3f48-42ec-ae45-21a92045ce6a___b3496d798dbfdb17c10219bd25b9ef4f.png",
  waterless:
    "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/f0864c02-3ee7-4d6b-b1bd-4c887542990b___cc05acde57800274da6eaaf656036299.png",
  quimicos:
    "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/3dd72de2-548a-440b-a87a-8654101163aa___bef515592c26facde4000e39b068aa2a.png",
};

export const SUSTAINABILITY_IMAGE =
  "https://lojalevis.vtexassets.com/assets/vtex.file-manager-graphql/images/45510b02-ec3c-4db0-894c-48104d76bcb6___bd79bc41ca41a9e4d43bd16260433fbb.png";

export const SUSTAINABILITY_RIBBON =
  "Estamos comprometidos a criar produtos duráveis e atemporais que acompanham as pessoas ao longo de suas vidas e fazem história.";

// destaque em negrito dentro do texto do card (handle original do rich-text)
const Strong = ({ children }: { children: ReactNode }) => (
  <span className="b vtex-rich-text-0-x-strong vtex-rich-text-0-x-strong--block-franqueado-06-content-02-card-text">
    {children}
  </span>
);

export const SUSTAINABILITY_CARDS: { icon: string; text: JSX.Element }[] = [
  {
    icon: ICONS.fibras,
    text: (
      <>
        Damos preferência para o uso de <Strong>fibras sustentáveis</Strong>, que
        consomem menos recursos e geram menos resíduos no planeta.
      </>
    ),
  },
  {
    icon: ICONS.algodao,
    text: (
      <>
        <Strong>83% do algodão</Strong> usado na Levi’s provém de fazendas
        certificadas pelo programa Better Cotton Iniciative (produtos orgânicos
        ou que venham de fornecedores de algodão reciclado).
      </>
    ),
  },
  {
    icon: ICONS.poliester,
    text: (
      <>
        Utilizamos <Strong>poliéster reciclado</Strong>, feito a partir do
        reaproveitamento de garrafas plásticas, que reduz a emissão de gases
        poluentes no planeta e o uso de água e evita o acúmulo de plástico nos
        aterros sanitários.
      </>
    ),
  },
  {
    icon: ICONS.madeira,
    text: (
      <>
        Alguns de nossos produtos são feitos com fibras de celulose que são
        fabricadas a partir de <Strong>madeira sustentável</Strong>, utilizando
        um processo de produção ecologicamente responsável, que{" "}
        <Strong>reutiliza 99,5% da água</Strong>.
      </>
    ),
  },
  {
    icon: ICONS.waterless,
    text: (
      <>
        Com a tecnologia <Strong>WATER{"<"}LESS</Strong>® nós economizamos
        aproximadamente <Strong>925 bilhões</Strong> de galões de água e
        reciclamos <Strong>1 trilhão e 522 bilhões</Strong> de galões até o
        momento. Produzimos <Strong>68%</Strong> do nosso jeans.
      </>
    ),
  },
  {
    icon: ICONS.quimicos,
    text: (
      <>
        Em 2015 criamos o{" "}
        <Strong>programa de contenção de produtos químicos</Strong>, em que
        fazemos melhores escolhas com relação a insumos utilizados na confecção
        de nossos produtos, para <Strong>reduzir danos ao meio ambiente</Strong>.
      </>
    ),
  },
];
