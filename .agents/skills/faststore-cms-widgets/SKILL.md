---
name: faststore-cms-widgets
description: "Reference for all available VTEX Headless CMS widgets to use in sections.json / JSONC schemas. Use whenever creating or editing a CMS section schema and you need to pick the correct widget for a field type."
---

# FastStore CMS — Widgets de Schema

Lista completa de widgets disponíveis para usar em `cms/faststore/sections.json` ou `cms/faststore/components/*.jsonc`.

## Como usar

Adicione a chave `"widget"` dentro da definição de propriedade:

```json
"meuCampo": {
  "type": "string",
  "title": "Meu Campo",
  "widget": {
    "ui:widget": "<nome-do-widget>"
  }
}
```

---

## Widgets disponíveis

### Texto simples
Sem widget — apenas `"type": "string"`.
```json
"title": { "type": "string", "title": "Título" }
```

### Textarea (texto longo sem formatação)
```json
"widget": { "ui:widget": "textarea" }
```

### Rich Text (WYSIWYG — negrito, itálico, listas, links)
```json
"widget": { "ui:widget": "draftjs-rich-text" }
```
> Use para campos onde o editor precisa formatar o texto.

### Imagem — Media Gallery (seleção da biblioteca de mídia)
```json
"widget": {
  "ui:widget": "media-gallery",
  "restrictMediaTypes": {
    "video": true,
    "image": ["png", "jpg", "jpeg", "gif", "svg", "webp"]
  }
}
```
> Preferido para imagens em seções CMS.

### Imagem — Image Uploader (upload direto)
```json
"widget": { "ui:widget": "image-uploader" }
```

### Cor (color picker)
```json
"widget": { "ui:widget": "color" }
```
> Retorna string hexadecimal, ex: `"#ff0000"`. Sempre defina `"default"`.

### Booleano (toggle)
Sem widget — use `"type": "boolean"`.
```json
"active": { "type": "boolean", "title": "Ativo", "default": true }
```

### Dropdown (seleção de opções fixas)
Sem widget — use `"enum"` + `"enumNames"`.
```json
"target": {
  "type": "string",
  "title": "Abrir link",
  "enum": ["_self", "_blank"],
  "enumNames": ["Mesma aba", "Nova aba"],
  "default": "_self"
}
```

### Data e hora
```json
"widget": { "ui:widget": "datetime" }
```

---

## Regras rápidas

- Todo campo deve ter `"title"` — é o label no editor CMS.
- Use `"default"` sempre que possível para que a seção funcione sem preenchimento.
- `"description"` em uma propriedade aparece como hint no editor (use para campos não óbvios).
- Enums precisam de `"enum"` + `"enumNames"` com o mesmo comprimento e ordem.
- Campos obrigatórios vão no array `"required"` do objeto pai.
