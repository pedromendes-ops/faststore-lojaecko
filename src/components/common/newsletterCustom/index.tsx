import { useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  Button,
  InputField,
  RadioField,
  RadioGroup,
  useUI,
} from "@faststore/ui";
import {
  useLazyQuery_unstable as useLazyQuery,
  useNewsletter_unstable as useNewsletter,
} from "@faststore/core/experimental";
import { gql } from "@faststore/core/api";

import styles from "./NewsletterCustom.module.scss";

type UpdateNewsletterGenderData = {
  updateNewsletterGender: {
    success: boolean;
    message: string;
  };
};

type UpdateNewsletterGenderVariables = {
  input: {
    email: string;
    gender: string;
  };
};

// @ts-ignore — operation registered after the store's GraphQL codegen runs (dev server restart)
const UPDATE_NEWSLETTER_GENDER = gql(`
  mutation UpdateNewsletterGender($input: UpdateNewsletterGenderInput!) {
    updateNewsletterGender(input: $input) {
      success
      message
    }
  }
`);

type NewsletterImage = {
  image: string;
};

type Props = {
  instagramHandle?: string;
  images?: NewsletterImage[];
  title?: string;
  description?: string;
  submitButtonLabel?: string;
};

export const NewsletterCustom = ({
  instagramHandle = "",
  images = [],
  title = "Assine nossa newsletter",
  description = "",
  submitButtonLabel = "Junte-se a nós",
}: Props) => {
  const { pushToast } = useUI();
  const { subscribeUser } = useNewsletter();
  const [updateGender] = useLazyQuery<
    UpdateNewsletterGenderData,
    UpdateNewsletterGenderVariables
  >(UPDATE_NEWSLETTER_GENDER, { input: { email: "", gender: "" } });

  const [gender, setGender] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handle = instagramHandle.replace("@", "");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const name = nameInputRef.current?.value ?? "";
    const email = emailInputRef.current?.value ?? "";

    setSubmitting(true);

    try {
      const data = await subscribeUser({ data: { name, email } });

      if (!data?.subscribeToNewsletter?.id) {
        throw new Error("Subscription failed");
      }

      if (gender) {
        const genderResult = await updateGender({ input: { email, gender } });

        if (!genderResult?.updateNewsletterGender?.success) {
          throw new Error("Gender update failed");
        }
      }

      pushToast({
        message: "Inscrição realizada com sucesso!",
        status: "INFO",
      });

      formRef.current?.reset();
      setGender("");
    } catch {
      pushToast({
        message: "Não foi possível concluir sua inscrição. Tente novamente.",
        status: "ERROR",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div aria-label="Newsletter" className={`${styles["bg-gray-footer"]} section`}>
      <div className="wrap">
        <div className={`container ${styles.newsletterCustom}`}>
          {images.length > 0 && (
            <div className={`${styles.newsletterCustomRigth}`}>
              {handle && (
                <a
                  href={`https://instagram.com/${handle}`}
                  target="_blank"
                  title="Nova janela: Instagram"
                  rel="noopener noreferrer"
                  className={styles.instagramHandle}
                >
                  @{handle}
                </a>
              )}
              <div className={styles.images}>
                {images.slice(0, 3).map((item, index) => (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Nova janela: Instagram"
                    href={`https://instagram.com/${handle}`}
                    className={styles.instagramImageHandle}
                  >
                    <img
                      width="265"
                      height="265"
                      key={index}
                      src={item.image}
                      alt={`${title} ${index + 1}`}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className={styles.content}>
            <h2 className={styles.title}>{title}</h2>
            {description && <p className={styles.description}>{description}</p>}

            <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.genderField}>
                <RadioGroup
                  name="newsletter-custom-gender"
                  selectedValue={gender}
                  onChange={(event) => setGender(event.target.value)}
                >
                  <div className={styles.genderOptions}>
                    <RadioField
                      id="newsletter-custom-gender-masculino"
                      label="Masculino"
                      value="Masculino"
                      name="gender"
                    />
                    <RadioField
                      id="newsletter-custom-gender-feminino"
                      label="Feminino"
                      value="Feminino"
                      name="gender"
                    />
                  </div>
                </RadioGroup>
              </div>
              <InputField
                id="newsletter-custom-name"
                type="text"
                label=""
                placeholder="Nome"
                required
                inputRef={nameInputRef}
              />

              <InputField
                id="newsletter-custom-email"
                type="email"
                label=""
                placeholder="E-mail"
                required
                inputRef={emailInputRef}
              />

              <Button type="submit" variant="secondary" loading={submitting}>
                {submitButtonLabel}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterCustom;
