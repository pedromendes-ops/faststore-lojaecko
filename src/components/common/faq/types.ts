export type FaqItem = {
  question: string
  answer: string
}

export type FaqProps = {
  title?: string
  items: FaqItem[]
}
