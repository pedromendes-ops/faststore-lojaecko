import { useMemo } from "react";
import {
  BreadcrumbSection,
  getOverriddenSection,
  isPLP,
  isSearchPage,
  usePage,
} from "@faststore/core";
import type { PLPContext, SearchPageContext } from "@faststore/core";
import { Breadcrumb, Icon, Link } from "@faststore/ui";

interface BreadcrumbItem {
  item: string;
  name: string;
  position: number;
}

interface BreadcrumbPlpProps {
  icon: string;
  alt: string;
  fallbackLabel: string;
  homeLabel?: string;
  homeIcon?: string;
  divider?: string;
}

interface BreadcrumbSlotProps {
  breadcrumbList: BreadcrumbItem[];
  icon: string;
  alt: string;
  homeLabel: string;
  homeIcon: string;
  divider: string;
  className?: string;
}

/**
 * The native Breadcrumb section is shared by PDP, PLP and Search. Outside
 * PLP/Search it keeps the stock look (native icon/alt only); on PLP/Search
 * it renders the CMS-configurable home label, home icon and divider.
 */
function BreadcrumbPlpSlot({
  breadcrumbList,
  icon,
  alt,
  homeLabel,
  homeIcon,
  divider,
  className = "",
}: BreadcrumbSlotProps) {
  const context = usePage<PLPContext | SearchPageContext>();
  const isCustomScope = isPLP(context) || isSearchPage(context);

  if (!isCustomScope) {
    return (
      <Breadcrumb
        breadcrumbList={breadcrumbList}
        className={`${className}`}
        homeLink={
          <Link
            data-fs-breadcrumb-link
            data-fs-breadcrumb-link-home
            aria-label={alt}
            href="/"
          >
            <Icon name={icon} width={18} height={18} weight="bold" />
          </Link>
        }
      />
    );
  }

  return (
    <Breadcrumb
      breadcrumbList={breadcrumbList}
      divider={divider}
      className={`${className} breadcrumb-list-plp`}
      homeLink={
        <Link
          data-fs-breadcrumb-link
          data-fs-breadcrumb-link-home
          aria-label={alt}
          href="/"
        >
          <Icon name={homeIcon} width={18} height={18} weight="bold" />
          <span>{homeLabel}</span>
        </Link>
      }
    />
  );
}

export function BreadcrumbPlp(props: BreadcrumbPlpProps) {
  const {
    homeLabel = "Home",
    homeIcon = "House",
    divider = "/",
    ...sectionProps
  } = props;

  const OverriddenBreadcrumb = useMemo(
    () =>
      getOverriddenSection({
        Section: BreadcrumbSection,
        components: {
          Breadcrumb: {
            Component: (
              slotProps: Omit<
                BreadcrumbSlotProps,
                "homeLabel" | "homeIcon" | "divider"
              >,
            ) => (
              <BreadcrumbPlpSlot
                {...slotProps}
                homeLabel={homeLabel}
                homeIcon={homeIcon}
                divider={divider}
              />
            ),
          },
        },
      }),
    [homeLabel, homeIcon, divider],
  );

  return <OverriddenBreadcrumb {...sectionProps} />;
}

export default BreadcrumbPlp;
