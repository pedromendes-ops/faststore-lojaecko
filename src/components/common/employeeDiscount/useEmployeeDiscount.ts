import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { sessionStore, useSession } from "src/sdk/session";

import { EMPLOYEE_SALES_CHANNEL } from "./constants";
import { stripEmployeeSalesChannelParam } from "./employeeChannelUrl";
import {
  getSalesChannel,
  patchSalesChannel,
  resolveTargetSalesChannel,
} from "./salesChannel";
import { useShopperProfile } from "./useShopperProfile";

/**
 * Mantém a política comercial (sales channel) em sincronia com o perfil real do
 * shopper na sessão VTEX:
 *
 * - `profile.isAuthenticated` + price table "funcionarios" → política 6
 * - já na política 6 com direito a ela → não faz nada
 * - na política 6 sem estar logado (ou sem a price table) → volta à padrão
 *
 * Os dois sinais vêm do Session Manager via BFF (`useShopperProfile`), não da
 * sessão do FastStore: `person` é preenchido a partir de `profile.id`, que a
 * VTEX também popula para visitante apenas identificado por e-mail
 * (`public.storeUserEmail`) e não logado — e nesse caso `priceTables` é
 * carregada mesmo assim, o que fazia um não-logado cair na política 6.
 *
 * O `sessionStore.set` do core já dispara o ValidateSession e a revalidação
 * do carrinho, então os preços refletem a nova política automaticamente.
 */
export function useEmployeeDiscount() {
  const { channel, isValidating, isSessionReady } = useSession();
  const profile = useShopperProfile();
  const router = useRouter();
  const hasAttemptedUpgrade = useRef(false);

  useEffect(() => {
    // Espera a sessão estabilizar para não decidir com dados intermediários.
    if (!isSessionReady || isValidating) {
      return;
    }

    // Perfil ainda carregando (ou Session Manager fora do ar): estado
    // desconhecido, não concede nem revoga.
    if (!profile) {
      return;
    }

    const targetSalesChannel = resolveTargetSalesChannel({
      isAuthenticated: profile.isAuthenticated,
      priceTables: profile.priceTables,
      salesChannel: getSalesChannel(channel),
    });

    if (!targetSalesChannel) {
      return;
    }

    // A subida para a política 6 é tentada uma única vez: se a VTEX recusar o
    // `sc` (401/403 em vtex.store-session), o ValidateSession do core engole o
    // erro e mantém o canal que o cliente mandou, o que geraria um loop
    // set -> validate -> set. A volta para a política padrão não tem essa
    // trava de propósito — é a direção que protege o preço e precisa poder
    // rodar sempre que o perfil não der direito ao desconto.
    if (targetSalesChannel === EMPLOYEE_SALES_CHANNEL) {
      if (hasAttemptedUpgrade.current) {
        return;
      }

      hasAttemptedUpgrade.current = true;
    } else {
      // Perdeu o direito: rearma para uma futura subida legítima (ex.: login
      // de funcionário sem recarregar a página).
      hasAttemptedUpgrade.current = false;
    }

    const applyTargetSalesChannel = () => {
      const currentSession = sessionStore.read();

      sessionStore.set({
        ...currentSession,
        channel: patchSalesChannel(currentSession.channel, targetSalesChannel),
      });
    };

    // Quem não tem direito ao desconto pode ter chegado na política 6 por um
    // `?sc=6` na URL (link compartilhado). O ValidateSession relê esse `sc` a
    // cada rodada, então limpamos a URL ANTES de corrigir a sessão — senão a
    // correção é desfeita na validação seguinte, em loop.
    const cleanUrl =
      targetSalesChannel !== EMPLOYEE_SALES_CHANNEL
        ? stripEmployeeSalesChannelParam(router.asPath)
        : null;

    if (!cleanUrl) {
      applyTargetSalesChannel();

      return;
    }

    router
      .replace(cleanUrl, undefined, { shallow: true })
      .catch(() => undefined)
      .finally(applyTargetSalesChannel);
  }, [profile, channel, isValidating, isSessionReady, router]);
}
