import { EMPLOYEE_SALES_CHANNEL } from "./constants";

/**
 * O `?sc=` da URL é o "pedido de política comercial" da VTEX: o
 * ValidateSession do core lê `window.location.search` e o `sc` de lá vence o
 * canal que está na sessão.
 *
 * Confirmado no ambiente: a conta aceita `sc=6` para visitante anônimo
 * (POST /api/sessions responde 201 com store.channel = "6"). Então, sem
 * remover o parâmetro, corrigir só a sessão não adianta — o próximo
 * ValidateSession relê o `sc=6` da URL e recoloca o usuário na política 6,
 * num ping-pong infinito com a regra de restore.
 *
 * Só mexemos no `sc` quando ele aponta para a política de funcionário e o
 * shopper não tem direito a ela. Outros valores de `sc` (links de campanha,
 * outras políticas) passam intactos.
 */
export function stripEmployeeSalesChannelParam(asPath: string): string | null {
  // `asPath` pode trazer hash ("/p?sc=6#reviews"); separa antes para não
  // deixar o fragmento colado no valor do último parâmetro.
  const hashIndex = asPath.indexOf("#");
  const hash = hashIndex === -1 ? "" : asPath.slice(hashIndex);
  const [pathname, search = ""] = (
    hashIndex === -1 ? asPath : asPath.slice(0, hashIndex)
  ).split("?");

  const params = new URLSearchParams(search);

  if (params.get("sc") !== EMPLOYEE_SALES_CHANNEL) {
    return null;
  }

  params.delete("sc");

  const remaining = params.toString();

  return `${pathname}${remaining ? `?${remaining}` : ""}${hash}`;
}
