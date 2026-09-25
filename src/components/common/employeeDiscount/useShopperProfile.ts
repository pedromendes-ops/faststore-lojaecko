import { useQuery_unstable as useQuery } from "@faststore/core/experimental";
import { gql } from "@faststore/core/api";
import type {
  ShopperProfileQuery,
  ShopperProfileQueryVariables,
} from "@generated/graphql";

/**
 * Lê o namespace `profile` da sessão VTEX pelo BFF
 * (src/graphql/thirdParty/resolvers/shopperProfile.ts).
 *
 * O nome da operação de propósito NÃO termina em "Query": o handler
 * /api/graphql do core só aplica `s-maxage` a operações com esse sufixo, então
 * esta resposta (que é por usuário) sai sempre como `no-cache, no-store`.
 */
const SHOPPER_PROFILE = gql(`
  query ShopperProfile {
    shopperProfile {
      isAuthenticated
      priceTables
    }
  }
`);

export type ShopperProfile = NonNullable<ShopperProfileQuery["shopperProfile"]>;

/**
 * `null` enquanto carrega ou quando o Session Manager falhou — nesse estado o
 * chamador não deve tomar nenhuma decisão sobre política comercial.
 *
 * Devolve a referência crua do SWR (estável entre renders) para poder entrar
 * direto na lista de dependências de um `useEffect`. A chave do SWR já embute
 * o cache busting de cookie de auth do core, então login/logout invalidam
 * este resultado automaticamente.
 */
export function useShopperProfile(): ShopperProfile | null {
  const { data } = useQuery<ShopperProfileQuery, ShopperProfileQueryVariables>(
    SHOPPER_PROFILE,
    {},
  );

  return data?.shopperProfile ?? null;
}
