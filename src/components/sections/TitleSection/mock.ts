import type {TitleSectionProps} from './types'

const MOCK_PROPS: TitleSectionProps = {
  config: {
    label: 'Title 01',
    active: true,
    grid: 'container',
    marginTop: 30,
    tag: 'h2',
    align: 'between',
  },
  content: {
    text: 'Mais vendidos',
    countdown: {
      active: true,
      label: 'Termina em',
      endDate: '2026-09-10T23:59:59-03:00',
    },
    link: {
      text: 'Veja mais',
      href: '/mais-vendidos',
      target: '_self',
    },
  }
  
}

export default MOCK_PROPS