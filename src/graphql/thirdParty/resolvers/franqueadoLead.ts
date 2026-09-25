// Entidade de leads da LP "Seja um franqueado", a mesma da loja legada (VTEX IO).
const MASTER_DATA_ENTITY = "FR";

// Host da API de Master Data. NÃO use a STORE_URL aqui: ela aponta para o
// próprio site (lojalevis.vtex.app), que devolve 405 no POST porque quem
// atende é o Next, não a VTEX. O host certo é o da conta, montado igual ao
// discovery.config (storeId + environment).
const ACCOUNT = process.env.NEXT_PUBLIC_STORE_ID ?? "lojalevis";
const MASTER_DATA_URL =
  process.env.MASTER_DATA_URL ?? `https://${ACCOUNT}.vtexcommercestable.com.br`;

type CreateFranqueadoLeadArgs = {
  input: {
    name: string;
    email: string;
    celular: string;
    state: string;
    city: string;
    interest: string;
    message?: string | null;
  };
};

// Mensagens iguais às do componente legado (lojalevis.store FormFranqueado).
const MESSAGES = {
  created: "Formulário enviado com sucesso!",
  duplicated: "Email já cadastrado!",
  failed: "Erro ao enviar formulário",
};

/**
 * Grava o lead no Master Data.
 *
 * Na loja legada o form dava POST direto em `/api/dataentities/FR/documents`,
 * porque o storefront era servido pelo próprio domínio VTEX. No headless isso
 * não vale: a chamada sai do BFF, como já faz o `newsletterGender`.
 */
const franqueadoLeadResolver = {
  Mutation: {
    createFranqueadoLead: async (
      _: never,
      { input }: CreateFranqueadoLeadArgs,
    ) => {
      try {
        const response = await fetch(
          `${MASTER_DATA_URL}/api/dataentities/${MASTER_DATA_ENTITY}/documents`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // a Master Data v1 exige este Accept nas escritas de documento
              Accept: "application/vnd.vtex.ds.v10+json",
            },
            body: JSON.stringify(input),
          },
        );

        if (!response.ok && response.status !== 400) {
          // o corpo traz o motivo real (campo inexistente, permissão, etc.)
          console.error(
            `[franqueadoLead] Master Data ${MASTER_DATA_ENTITY} respondeu ${response.status}:`,
            await response.text().catch(() => ""),
          );
        }

        if (response.status === 201) {
          return { status: 201, success: true, message: MESSAGES.created };
        }

        // A entidade recusa e-mail repetido com 400 — o legado tratava esse
        // status como "já cadastrado" em vez de erro genérico.
        if (response.status === 400) {
          return { status: 400, success: false, message: MESSAGES.duplicated };
        }

        return {
          status: response.status,
          success: false,
          message: MESSAGES.failed,
        };
      } catch {
        return { status: 500, success: false, message: MESSAGES.failed };
      }
    },
  },
};

export default franqueadoLeadResolver;
