import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLazyQuery_unstable as useLazyQuery } from "@faststore/core/experimental";
import { gql } from "@faststore/core/api";

import { INITIAL_FORM, NO_FEEDBACK } from "../types";
import type { FormFeedback, FormState } from "../types";
import { useIbgeCities } from "./useIbgeCities";
import { useIbgeStates } from "./useIbgeStates";

type FieldChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

type CreateFranqueadoLeadData = {
  createFranqueadoLead: {
    status: number;
    success: boolean;
    message: string;
  };
};

type CreateFranqueadoLeadVariables = {
  input: {
    name: string;
    email: string;
    celular: string;
    state: string;
    city: string;
    interest: string;
    message?: string;
  };
};

const EMPTY_INPUT: CreateFranqueadoLeadVariables["input"] = {
  name: "",
  email: "",
  celular: "",
  state: "",
  city: "",
  interest: "",
};

// Mensagens de validação iguais às do form legado
const VALIDATION = {
  location: "Selecione um estado e uma cidade",
  interest: "Selecione um interesse",
  failed: "Erro ao enviar formulário",
};

// @ts-ignore — operação registrada após o codegen da loja rodar (reiniciar o dev server)
const CREATE_FRANQUEADO_LEAD = gql(`
  mutation CreateFranqueadoLead($input: CreateFranqueadoLeadInput!) {
    createFranqueadoLead(input: $input) {
      status
      success
      message
    }
  }
`);

/**
 * Controla o formulário do bloco 01: campos, UFs e municípios do IBGE, e o
 * envio do lead para a entidade FR do Master Data (via BFF). Mesmos dados e
 * mesmas mensagens do FormFranqueado da loja legada.
 */
export const useFranqueadoForm = () => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedback>(NO_FEEDBACK);

  const { states, loading: loadingStates } = useIbgeStates();
  const { cities, loading: loadingCities } = useIbgeCities(form.estado);

  const [createLead] = useLazyQuery<
    CreateFranqueadoLeadData,
    CreateFranqueadoLeadVariables
  >(CREATE_FRANQUEADO_LEAD, { input: EMPTY_INPUT });

  const updateField = (field: keyof FormState) => (event: FieldChangeEvent) => {
    const { value } = event.target;

    setForm((prev) => ({
      ...prev,
      [field]: value,
      // Ao trocar de estado, zera a cidade previamente escolhida.
      ...(field === "estado" ? { cidade: "" } : null),
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFeedback(NO_FEEDBACK);
    if (!form.estado || !form.cidade) {
      setFeedback({ isError: true, message: VALIDATION.location });
      return;
    }

    if (!form.interesse) {
      setFeedback({ isError: true, message: VALIDATION.interest });
      return;
    }

    setSubmitting(true);

    try {
      // as chaves do payload são as colunas da entidade FR, como no legado
      const result = await createLead({
        input: {
          name: form.name,
          email: form.email,
          celular: form.phone,
          state: form.estado,
          city: form.cidade,
          interest: form.interesse,
          message: form.message,
        },
      });

      const response = result?.createFranqueadoLead;

      setFeedback({
        isError: !response?.success,
        message: response?.message ?? VALIDATION.failed,
      });

      if (response?.success) {
        setForm(INITIAL_FORM);
      }
    } catch {
      setFeedback({ isError: true, message: VALIDATION.failed });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    states,
    loadingStates,
    cities,
    loadingCities,
    submitting,
    feedback,
    updateField,
    handleSubmit,
  };
};
