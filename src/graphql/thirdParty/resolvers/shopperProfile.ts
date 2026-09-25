// Proxy backend-only do Session Manager da VTEX (namespace `profile`).
//
// Encaminha os cookies do shopper (`vtex_session` / `VtexIdclientAutCookie`)
// server-side, mesmo padrão do resolver de wishlist. É a única fonte confiável
// de "está logado?" + "quais price tables?" — ver o comentário do typeDef em
// src/graphql/thirdParty/typeDefs/shopperProfile.graphql.
//
// Doc: https://developers.vtex.com/docs/api-reference/session-manager-api#get-/api/sessions

import storeConfig from "discovery.config";

// Mesma forma mínima de contexto usada pelos outros resolvers third-party.
interface ShopperProfileContext {
  headers?: Record<string, string>;
}

const SESSION_MANAGER_URL =
  process.env.SESSION_MANAGER_URL ??
  `https://${storeConfig.api.storeId}.${storeConfig.api.environment}.com.br/api/sessions`;

// Só os dois itens que interessam — evita trafegar a sessão inteira.
const SESSION_ITEMS = "profile.isAuthenticated,profile.priceTables";

interface SessionValue {
  value?: string | boolean | null;
}

interface SessionResponse {
  namespaces?: {
    profile?: {
      isAuthenticated?: SessionValue | null;
      priceTables?: SessionValue | null;
    } | null;
  } | null;
}

interface ShopperProfileResult {
  isAuthenticated: boolean;
  priceTables: string[];
}

/** O Session Manager devolve os valores como string ("true"/"false"). */
const toBoolean = (value: SessionValue["value"]) =>
  typeof value === "boolean" ? value : String(value ?? "").toLowerCase() === "true";

/** Price tables vêm em uma única string separada por vírgula. */
const toPriceTables = (value: SessionValue["value"]) =>
  String(value ?? "")
    .split(",")
    .map((priceTable) => priceTable.trim().toLowerCase())
    .filter(Boolean);

const shopperProfileResolver = {
  Query: {
    shopperProfile: async (
      _: unknown,
      __: unknown,
      ctx: ShopperProfileContext,
    ): Promise<ShopperProfileResult | null> => {
      const cookie = ctx?.headers?.cookie ?? "";

      // Sem cookie não há sessão para consultar: visitante anônimo.
      if (!cookie) {
        return { isAuthenticated: false, priceTables: [] };
      }

      try {
        const response = await fetch(
          `${SESSION_MANAGER_URL}?items=${encodeURIComponent(SESSION_ITEMS)}`,
          {
            method: "GET",
            headers: { Accept: "application/json", cookie },
          },
        );

        if (!response.ok) {
          throw new Error(`Session Manager request failed: ${response.status}`);
        }

        const profile = ((await response.json()) as SessionResponse)?.namespaces
          ?.profile;

        return {
          isAuthenticated: toBoolean(profile?.isAuthenticated?.value),
          priceTables: toPriceTables(profile?.priceTables?.value),
        };
      } catch (error) {
        console.error("Failed to read shopper profile from Session Manager:", error);

        // `null` = estado desconhecido. Melhor não mexer na política comercial
        // do que conceder (ou revogar) o desconto por causa de uma falha de
        // rede — quem consome trata `null` como "não faz nada".
        return null;
      }
    },
  },
};

export default shopperProfileResolver;
