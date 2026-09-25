const MASTER_DATA_ENTITY = "NL";

type UpdateNewsletterGenderArgs = {
  input: {
    email: string;
    gender: string;
  };
};

const newsletterGenderResolver = {
  Mutation: {
    updateNewsletterGender: async (
      _: never,
      { input }: UpdateNewsletterGenderArgs,
    ) => {
      const { email, gender } = input;
      const storeUrl = process.env.STORE_URL ?? "https://lojalevis.vtex.app";

      try {
        // The "NL" entity only has public write permission configured
        // (no read/search), so we can't look up an existing document —
        // each submission is a new document in Master Data.
        const writeResponse = await fetch(
          `${storeUrl}/api/dataentities/${MASTER_DATA_ENTITY}/documents`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ email, gender }),
          },
        );

        if (!writeResponse.ok) {
          throw new Error("Failed to save gender in Master Data");
        }

        return { success: true, message: "Gênero salvo com sucesso" };
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error ? error.message : "Erro desconhecido",
        };
      }
    },
  },
};

export default newsletterGenderResolver;
