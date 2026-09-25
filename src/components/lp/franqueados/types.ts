export type SelectOption = {
  value: string;
  label: string;
};

export type FormState = {
  name: string;
  email: string;
  phone: string;
  estado: string;
  cidade: string;
  interesse: string;
  message: string;
};

export const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  estado: "",
  cidade: "",
  interesse: "",
  message: "",
};

/** Retorno do form: mensagem inline abaixo dos campos, como no legado. */
export type FormFeedback = {
  isError: boolean;
  message: string;
};

export const NO_FEEDBACK: FormFeedback = { isError: false, message: "" };
