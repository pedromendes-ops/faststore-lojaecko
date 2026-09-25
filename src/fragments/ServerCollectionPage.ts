import { gql } from "@faststore/core/api";

// Overrides the core ServerCollectionPage fragment to also pull the category
// SEO copy. Because this fragment is part of ServerCollectionPageQuery — which
// runs in the PLP's getServerSideProps — `aboutCategory` and `textSEO` end up
// in the initial HTML (indexable, visible with JS disabled) and are read from
// usePLP() by src/components/plp/textSEO instead of a client-side query.
//@ts-ignore
export const fragment = gql(`
  fragment ServerCollectionPage on Query {
    collection(slug: $slug) {
      id
      aboutCategory
      textSEO
    }
  }
`);
