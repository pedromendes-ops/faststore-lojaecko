import { usePDP } from "src/sdk/overrides/PageProvider";
import { useProductDetailsData } from "../ProductDetailsCustom/hooks/useProductDetailsData";
import styles from "./styles.module.scss";

type Props = {
  prefixo?: string;
};

export const ModelSize = ({
  prefixo = 'Modelo veste tamanho',

}: Props) => {

  const context = usePDP();
  const product = context?.data?.product;

  if (!product) {
    throw new Error("NotFound");
  }

  const data = useProductDetailsData(product);
  const properties = data?.properties ?? [];

  const valueTamanhoModelo = properties.find((item) => item.name === 'TamanhoModelo')?.value
  const hasTamanhoModelo = !!valueTamanhoModelo

  console.log('data', data)

  if (!hasTamanhoModelo) return null

  return (
      <div className={styles.model_size}>
        <p>{prefixo} <strong>{valueTamanhoModelo}</strong></p>
      </div>
  );
};

export default ModelSize;
