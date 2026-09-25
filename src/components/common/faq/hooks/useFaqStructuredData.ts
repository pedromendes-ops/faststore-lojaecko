import { useMemo } from "react";

import type { FaqItem } from "../types";

type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
};

const collectText = (nodes: LexicalNode[] = []): string =>
  nodes
    .map((node) => {
      if (node.type === "text") return node.text ?? "";

      return collectText(node.children);
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

// A resposta vem como o editorState (JSON) do widget draftjs-rich-text do
// CMS, mas o FAQPage JSON-LD exige texto puro — aqui extraímos só os nós de
// texto da árvore do Lexical.
const extractPlainText = (value: string): string => {
  try {
    const parsed = JSON.parse(value);

    return collectText(parsed?.root?.children);
  } catch {
    return value;
  }
};

export const useFaqStructuredData = (items: FaqItem[]) => {
  const mainEntity = useMemo(
    () =>
      items
        .map((item) => ({
          questionName: item.question,
          acceptedAnswerText: extractPlainText(item.answer),
        }))
        .filter((item) => item.questionName && item.acceptedAnswerText),
    [items],
  );

  return { mainEntity };
};
