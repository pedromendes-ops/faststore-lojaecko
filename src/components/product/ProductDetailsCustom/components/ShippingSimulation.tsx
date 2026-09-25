import type { ChangeEvent } from "react";
import { useState } from "react";

import { Link } from "@faststore/ui";

// Relative path (not the `src/*` alias) so it resolves to this store's
// usePriceFormatter override, which forces two decimals (e.g. "R$ 89,90"). The
// alias would resolve to the core version (minimumFractionDigits: 0).
import { usePriceFormatter } from "../../../../sdk/product/useFormattedPrice";
import { useShippingSimulation } from "src/sdk/shipping/useShippingSimulation";

import styles from "../styles.module.scss";
import type { shippingSimulation } from "../../../../types/shipping.typings";

export interface ShippingSimulationProps {
  productShippingInfo: {
    id: string;
    quantity: number;
    seller: string;
  };
  title?: string;
  inputLabel?: string;
  idkPostalCodeLabel?: string;
  idkPostalCodeHref?: string;
  buttonLabel?: string;
  invalidPostalCodeErrorMessage?: string;
}

const ESTIMATE_MESSAGES: Record<
  string,
  { 0: string; 1: string; other: string }
> = {
  bd: { 0: "Hoje", 1: "Em 1 dia útil", other: "Em até # dias úteis" },
  d: { 0: "Hoje", 1: "Em 1 dia", other: "Em até # dias" },
  h: { 0: "Agora", 1: "Em 1 hora", other: "Em até # horas" },
  m: { 0: "Agora", 1: "Em 1 minuto", other: "Em até # minutos" },
};

function formatShippingEstimate(estimate?: string | null): string {
  if (!estimate) {
    return "";
  }

  const value = estimate.split(/\D+/)[0];
  const unit = estimate.split(/[0-9]+/)[1];
  const isValidNumber = value !== "" && !Number.isNaN(Number(value));

  if (!isValidNumber || !ESTIMATE_MESSAGES[unit]) {
    return "";
  }

  const count = Number(value);
  const key = count < 2 ? (count as 0 | 1) : "other";

  return ESTIMATE_MESSAGES[unit][key].replace("#", value);
}

const WEEKDAYS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Formats the concrete delivery date (`shippingEstimateDate`, an ISO string
 * returned by VTEX, e.g. "2026-07-08T00:01:00-03:00") into a PT-BR label:
 * "Você receberá Hoje/até Amanhã/até {dia da semana}, dia DD/MM".
 *
 * Falls back to the relative estimate (from the raw `shippingEstimate`) when no
 * concrete date is available.
 */
function formatDeliveryDate(
  shippingEstimateDate?: string | null,
  shippingEstimate?: string | null,
): string {
  if (!shippingEstimateDate) {
    return formatShippingEstimate(shippingEstimate);
  }

  const deliveryDate = new Date(shippingEstimateDate);

  if (Number.isNaN(deliveryDate.getTime())) {
    return formatShippingEstimate(shippingEstimate);
  }

  const today = startOfDay(new Date());
  const target = startOfDay(deliveryDate);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const day = String(deliveryDate.getDate()).padStart(2, "0");
  const month = String(deliveryDate.getMonth() + 1).padStart(2, "0");

  if (target.getTime() === today.getTime()) {
    return `Você receberá Hoje, dia ${day}/${month}`;
  }

  if (target.getTime() === tomorrow.getTime()) {
    return `Você receberá até Amanhã, dia ${day}/${month}`;
  }

  return `Você receberá até ${WEEKDAYS[deliveryDate.getDay()]}, dia ${day}/${month}`;
}

/** Keeps only digits (max 8) and formats them as `#####-###`. */
function maskCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/** A Brazilian postal code is complete once it has 8 digits. */
function isCompleteCep(value?: string): boolean {
  return (value ?? "").replace(/\D/g, "").length === 8;
}

/**
 * Self-contained shipping ("Calcule o frete") simulator for the custom PDP.
 *
 * Reuses the core `useShippingSimulation` hook (same BFF query + session
 * pre-fill the native component uses) but renders a store-owned layout: a
 * masked CEP input with an embedded "Calcular" button (disabled until the CEP
 * has 8 digits), the IDK link, and a results table mirroring the native option
 * table (carrier + estimate ... price). SLA `price` already comes in reais; the
 * estimate is re-translated to PT-BR from the raw `shippingEstimate`.
 */
export function ShippingSimulation({
  productShippingInfo,
  title = "Calcule o frete",
  inputLabel = "CEP",
  idkPostalCodeLabel = "Não sei o meu CEP",
  idkPostalCodeHref = "https://buscacepinter.correios.com.br/app/endereco/index.php",
  buttonLabel = "Calcular",
  invalidPostalCodeErrorMessage = "CEP inválido. Verifique o número e tente novamente.",
}: ShippingSimulationProps) {
  const formatPrice = usePriceFormatter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    input,
    shippingSimulation,
    handleSubmit,
    handleOnInput,
  }: {
    handleSubmit: () => Promise<void>;
    input: any;
    handleOnClear: () => void;
    handleOnInput: (e: ChangeEvent<HTMLInputElement>) => void;
    shippingSimulation: shippingSimulation | undefined;
  } = useShippingSimulation({
    shippingItem: productShippingInfo,
    invalidPostalCodeErrorMessage,
  });

  const { postalCode, errorMessage } = input;
  const canCalculate = isCompleteCep(postalCode);

  const options = shippingSimulation?.logisticsInfo?.[0]?.slas ?? [];

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    event.currentTarget.value = maskCep(event.currentTarget.value);
    handleOnInput(event);
  };

  const handleCalculate = async () => {
    if (!canCalculate || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      await handleSubmit();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      data-fs-shipping-simulation
      className={styles["shipping-simulation"]}
    >
      <h3 data-fs-shipping-simulation-title>{title}</h3>

      <div data-fs-shipping-container>
        <div
          data-fs-shipping-cep-field
          data-fs-shipping-cep-field-error={Boolean(errorMessage)}
          className={styles["shipping-cep-field"]}
        >
          <input
            id="shipping-postal-code"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            aria-label={inputLabel}
            placeholder="00000-000"
            value={postalCode ?? ""}
            onChange={handleInput}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleCalculate();
              }
            }}
          />
          <button
            type="button"
            onClick={handleCalculate}
            disabled={!canCalculate || isLoading}
            data-fs-calcule-shipping
          >
            {isLoading ? (
              <span
                aria-label="Calculando"
                className={styles["shipping-simulation-spinner"]}
              />
            ) : (
              buttonLabel
            )}
          </button>
        </div>
        <div data-fs-shipping-simulation-footer>
          <Link
            data-fs-shipping-simulation-link
            href={idkPostalCodeHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span
              aria-hidden
              className={styles["shipping-simulation-link-icon"]}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_5264_39179)">
                  <path
                    d="M11.9704 4.92904L9.14194 7.75747L10.5562 9.17168L13.3846 6.34326C14.5513 5.17653 16.4605 5.17653 17.6272 6.34326C18.794 7.50998 18.794 9.41917 17.6272 10.5859L14.7988 13.4143L16.213 14.8285L19.0414 12.0001C20.9931 10.0485 20.9931 6.88066 19.0414 4.92904C17.0898 2.97743 13.922 2.97743 11.9704 4.92904ZM13.3846 14.8285L10.5562 17.657C9.38943 18.8237 7.48024 18.8237 6.31352 17.657C5.14679 16.4902 5.14679 14.5811 6.31352 13.4143L9.14194 10.5859L7.72773 9.17168L4.8993 12.0001C2.94769 13.9517 2.94769 17.1196 4.8993 19.0712C6.85092 21.0228 10.0188 21.0228 11.9704 19.0712L14.7988 16.2428L13.3846 14.8285ZM8.43484 14.1214L14.0917 8.46458L15.5059 9.87879L9.84905 15.5356L8.43484 14.1214Z"
                    fill="#6D686A"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_5264_39179">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(-5 12) rotate(-45)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </span>
            {idkPostalCodeLabel}
          </Link>
        </div>
      </div>

      {errorMessage && <p data-fs-shipping-simulation-error>{errorMessage}</p>}

      {options.length > 0 && (
        <div data-fs-shipping-simulation-result>
          <table data-fs-shipping-simulation-table>
            <thead>
              <tr data-fs-shipping-simulation-table-row>
                <th data-fs-shipping-simulation-table-header>Entrega</th>
                <th data-fs-shipping-simulation-table-header>Prazo</th>
                <th data-fs-shipping-simulation-table-header>Valor</th>
              </tr>
            </thead>
            <tbody>
              {options.map((option, index) => (
                <tr
                  data-fs-shipping-simulation-table-row
                  key={`${option?.carrier}-${index}`}
                >
                  <td
                    data-fs-shipping-simulation-table-cell
                    data-fs-shipping-simulation-option-carrier
                  >
                    {option?.carrier}
                  </td>
                  <td
                    data-fs-shipping-simulation-table-cell
                    data-fs-shipping-simulation-option-estimate
                  >
                    {formatDeliveryDate(
                      option?.shippingEstimateDate,
                      option?.shippingEstimate,
                    )}
                  </td>
                  <td
                    data-fs-shipping-simulation-table-cell
                    data-fs-shipping-simulation-option-price
                  >
                    {option?.price === 0
                      ? "Grátis"
                      : formatPrice(option?.price ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p data-fs-shipping-simulation-note>
            O prazo indicado para entrega começa a contar somente após a
            confirmação de pagamento.
          </p>
        </div>
      )}
    </section>
  );
}

export default ShippingSimulation;
