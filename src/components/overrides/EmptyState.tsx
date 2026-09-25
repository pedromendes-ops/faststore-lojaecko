import type { SectionOverride } from 'src/typings/overrides'
import NotFound from '../common/NotFound/NotFound'

const SECTION = 'EmptyState' as const

// Replaces the inner `EmptyState` slot rendered by the native EmptyState
// section (used by the 404 route) with the Levi's-branded NotFound layout.
const override: SectionOverride = {
  section: SECTION,
  components: {
    EmptyState: {
      Component: NotFound,
    },
  },
}

export { override }
