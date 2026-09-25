import { useMemo } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode, AutoLinkNode } from "@lexical/link";

// Nós que podem aparecer no JSON gerado pelo widget de rich text do CMS.
// Precisam estar registrados, senão o Lexical lança erro ao desserializar.
const NODES: InitialConfigType["nodes"] = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  AutoLinkNode,
];

type ViewerProps = {
  // JSON do editor state (string serializada ou objeto), vindo do widget de
  // rich text do CMS.
  value?: string | Record<string, unknown> | null;
  className?: string;
  namespace?: string;
};

type LexicalNode = {
  type?: string;
  tag?: string;
  children?: LexicalNode[];
  [key: string]: unknown;
};

// O editor do CMS cria um novo heading a cada Enter, então "GUIA DE\nTAMANHOS"
// vira dois nós <h1> em sequência em vez de um <h1> com quebra de linha —
// múltiplos <h1> quebram a semântica de SEO/acessibilidade. Aqui mesclamos
// headings consecutivos do mesmo nível num só, unindo com um linebreak.
const mergeConsecutiveHeadings = (nodes: LexicalNode[]): LexicalNode[] => {
  const merged: LexicalNode[] = [];

  for (const node of nodes) {
    const previous = merged[merged.length - 1];
    const isSameHeadingAsPrevious =
      node.type === "heading" &&
      previous?.type === "heading" &&
      previous.tag === node.tag;

    if (isSameHeadingAsPrevious) {
      previous.children = [
        ...(previous.children ?? []),
        { type: "linebreak", version: 1 },
        ...(node.children ?? []),
      ];
      continue;
    }

    merged.push({ ...node });
  }

  return merged;
};

// Normaliza o valor recebido para a string de editorState que o Lexical espera.
// Retorna null quando não há conteúdo renderizável (evita o throw de estado
// vazio em LexicalComposer/setEditorState).
const normalizeEditorState = (value: ViewerProps["value"]): string | null => {
  if (!value) {
    return null;
  }

  let parsed: { root?: { children?: LexicalNode[] } };

  try {
    parsed = typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    // Não é um JSON válido de editor state — nada a renderizar.
    return null;
  }

  // Estado sem nós: tratamos como vazio para não quebrar o composer.
  if (!parsed?.root?.children?.length) {
    return null;
  }

  parsed.root.children = mergeConsecutiveHeadings(parsed.root.children);

  return JSON.stringify(parsed);
};

/**
 * Viewer somente-leitura para o conteúdo de rich text do CMS.
 *
 * O widget não entrega uma string simples nem HTML, e sim o JSON do editor
 * state. Este componente recebe esse JSON e o renderiza com o Lexical em modo
 * não editável.
 */
export const Viewer = ({
  value,
  className,
  namespace = "viewer",
}: ViewerProps) => {
  const editorState = useMemo(() => normalizeEditorState(value), [value]);

  if (!editorState) {
    return null;
  }

  const initialConfig: InitialConfigType = {
    namespace,
    editable: false,
    editorState,
    nodes: NODES,
    onError: (error: Error) => {
      // Em modo leitura preferimos não derrubar a árvore por conteúdo
      // malformado vindo do CMS.
      console.error("[Viewer] erro ao renderizar rich text:", error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={<ContentEditable className={className} />}
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
};

export default Viewer;
