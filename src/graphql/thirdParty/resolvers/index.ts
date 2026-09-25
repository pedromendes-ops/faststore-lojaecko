import franqueadoLeadResolver from "./franqueadoLead";
import globalSectionsResolver from "./globalSections";
import newsletterGenderResolver from "./newsletterGender";
import shopTheLookResolver from "./shopTheLook";
import shopperProfileResolver from "./shopperProfile";
import textSEOResolver from "./textSEO";
import wishlistResolver from "./wishlist";

// Deep-merges the Query/Mutation maps so resolvers that each contribute their
// own Query (and/or Mutation) fields don't overwrite one another.
const mergeResolvers = (
  resolvers: Array<Record<string, Record<string, unknown>>>,
) => {
  const merged: Record<string, Record<string, unknown>> = {};

  for (const resolver of resolvers) {
    for (const [typeName, fields] of Object.entries(resolver)) {
      merged[typeName] = { ...(merged[typeName] ?? {}), ...fields };
    }
  }

  return merged;
};

const resolvers = mergeResolvers([
  franqueadoLeadResolver,
  globalSectionsResolver,
  newsletterGenderResolver,
  shopTheLookResolver,
  shopperProfileResolver,
  textSEOResolver,
  wishlistResolver,
]);

export default resolvers;
