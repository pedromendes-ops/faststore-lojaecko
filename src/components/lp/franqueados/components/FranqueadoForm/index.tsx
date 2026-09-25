import { useFranqueadoForm } from "../../hooks/useFranqueadoForm";
import { FORM_ANCHOR_ID, INTEREST_OPTIONS } from "./constants";
import styles from "./styles.module.scss";

/**
 * Formulário "Seja um franqueado!" (bloco 01). Só a marcação: os campos, as
 * UFs/municípios do IBGE e o envio ao Master Data vêm de `useFranqueadoForm`.
 */
export const FranqueadoForm = () => {
  const {
    form,
    states,
    loadingStates,
    cities,
    loadingCities,
    submitting,
    feedback,
    updateField,
    handleSubmit,
  } = useFranqueadoForm();

  return (
    <div
      className={`${styles.form} lojalevis-store-2-x-form-franqueado`}
      id={FORM_ANCHOR_ID}
    >
      <strong className="lojalevis-store-2-x-form-franqueado--title">
        Seja um franqueado!
      </strong>

      <form onSubmit={handleSubmit}>
        <div className="lojalevis-store-2-x-form-container-franqueado">
          <input
            className="lojalevis-store-2-x-input-franqueado"
            type="text"
            inputMode="text"
            autoComplete="name"
            name="name"
            placeholder="Nome completo"
            value={form.name}
            onChange={updateField("name")}
            required
          />
          <input
            className="lojalevis-store-2-x-input-franqueado"
            type="email"
            inputMode="email"
            autoComplete="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={updateField("email")}
            required
          />
          <input
            className="lojalevis-store-2-x-input-franqueado"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            name="phone"
            placeholder="Telefone"
            value={form.phone}
            onChange={updateField("phone")}
            required
          />

          <select
            className="lojalevis-store-2-x-select-franqueado"
            name="estado"
            value={form.estado}
            onChange={updateField("estado")}
            required
            disabled={loadingStates}
            data-empty={form.estado === "" ? "true" : undefined}
          >
            <option value="" disabled>
              {loadingStates ? "Carregando estados..." : "Estado"}
            </option>
            {states.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>

          <select
            className="lojalevis-store-2-x-select-franqueado"
            name="cidade"
            value={form.cidade}
            onChange={updateField("cidade")}
            required
            disabled={!form.estado || loadingCities}
            data-empty={form.cidade === "" ? "true" : undefined}
          >
            <option value="" disabled>
              {loadingCities ? "Carregando cidades..." : "Cidade"}
            </option>
            {cities.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>

          <select
            className="lojalevis-store-2-x-select-franqueado"
            name="interesse"
            value={form.interesse}
            onChange={updateField("interesse")}
            required
            data-empty={form.interesse === "" ? "true" : undefined}
          >
            <option value="" disabled>
              Interesse
            </option>
            {INTEREST_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <textarea
            className="lojalevis-store-2-x-textarea-franqueado"
            name="message"
            rows={7}
            placeholder="Escreva a sua mensagem"
            value={form.message}
            onChange={updateField("message")}
          />

          <div className="lojalevis-store-2-x-form-franqueado-actions">
            {feedback.message.length > 0 && (
              <span data-is-success={!feedback.isError} role="status">
                {feedback.message}
              </span>
            )}

            <button
              type="submit"
              disabled={submitting}
              data-disabled={submitting}
            >
              {submitting ? "Enviando..." : "Enviar Formulário"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FranqueadoForm;
