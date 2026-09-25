import { Fragment } from "react";
import type { ReactNode } from "react";

type Props = {
  text?: string;
  className?: string;
};

// Converte os marcadores "**texto**" em negrito (<strong>). Mantém o restante
// do texto como está.
const renderBold = (line: string): ReactNode[] => {
  return line.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    const match = part.match(/^\*\*([^*]+)\*\*$/);

    if (match) {
      return <strong key={index}>{match[1]}</strong>;
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
};

/**
 * RichText reutilizável: recebe um texto simples e renderiza
 * - "**texto**" como negrito
 * - "\n" (ou "/n" / quebra de linha real) como <br />
 */
export const RichText = ({ text = "", className }: Props) => {
  if (!text) {
    return null;
  }

  const lines = text.replace(/\\n|\/n/g, "\n").split("\n");

  return (
    <span className={className}>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {renderBold(line)}
          {index < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </span>
  );
};

export default RichText;
