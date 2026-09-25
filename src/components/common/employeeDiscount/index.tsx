import { useEmployeeDiscount } from "./useEmployeeDiscount";

/**
 * Componente headless (não renderiza nada): apenas mantém a política
 * comercial em sincronia com a price table de funcionário. Montado no
 * HeaderCustom para rodar em todas as páginas.
 */
export function EmployeeDiscount() {
  useEmployeeDiscount();

  return null;
}
