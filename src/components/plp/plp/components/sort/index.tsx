import { useSearch } from "@faststore/sdk";
import { SelectField } from "@faststore/ui";

const OptionsMap = {
  price_desc: "Preço, decrescente",
  price_asc: "Preço, crescente",
  orders_desc: "Mais vendidos",
  name_asc: "Nome, A-Z",
  name_desc: "Nome, Z-A",
  release_desc: "Data de lançamento",
  discount_desc: "Desconto",
  score_desc: "Relevância",
};

const keys = Object.keys(OptionsMap) as Array<keyof typeof OptionsMap>;
export interface SortProps {
  label?: string;
  options?: {
    price_desc?: string;
    price_asc?: string;
    orders_desc?: string;
    name_asc?: string;
    name_desc?: string;
    release_desc?: string;
    discount_desc?: string;
    score_desc?: string;
  };
}

type SortOptionKeys = keyof typeof OptionsMap;

function Sort({ label = "Sort by", options = OptionsMap }: SortProps) {
  const { state, setState } = useSearch();

  const optionsMap = Object.keys(options).reduce((acc, currentKey) => {
    acc[currentKey as SortOptionKeys] =
      options[currentKey as SortOptionKeys] ??
      OptionsMap[currentKey as SortOptionKeys];
    return acc;
  }, {} as Record<SortOptionKeys, string>);

  return (
    <SelectField
      id="sort-select"
      className="sort / text__title-mini-alt"
      label={label}
      options={optionsMap}
      onChange={(e) => {
        const sort = keys[e.target.selectedIndex];

        setState({
          ...state,
          sort,
          page: 0,
        });
      }}
      value={state.sort}
      testId="search-sort"
    />
  );
}

export default Sort;
