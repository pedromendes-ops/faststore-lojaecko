import * as React from "react";

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#2E2E2E"
      d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4"
    ></path>
  </svg>
);

const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10 3.43506L9.10406 2.51416C6.99863 0.350083 3.14268 1.09712 1.75045 3.81605C1.09567 5.09479 0.948438 6.94058 2.14286 9.29697C3.29322 11.5664 5.68459 14.2831 10 17.2432C14.3154 14.2831 16.7068 11.5664 17.8571 9.29697C19.0516 6.94058 18.9043 5.09479 18.2496 3.81605C16.8573 1.09712 13.0014 0.350083 10.8959 2.51416L10 3.43506ZM10 18.75C-9.16641 6.08551 4.09845 -3.80108 9.7804 1.42885C9.85493 1.49746 9.92816 1.56867 10 1.64251C10.0718 1.56867 10.1451 1.49747 10.2196 1.42886C15.9015 -3.8011 29.1664 6.0855 10 18.75Z"
      fill="black"
    />
  </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5.3223 12.9299C4.33385 11.5841 3.75 9.92275 3.75 8.125C3.75 3.63769 7.38769 0 11.875 0C16.3623 0 20 3.63769 20 8.125C20 12.6123 16.3623 16.25 11.875 16.25C10.0768 16.25 8.41498 15.6658 7.06906 14.6769L7.07014 14.6777C7.03328 14.7277 6.99222 14.7756 6.94696 14.8208L2.13388 19.6339C1.64573 20.122 0.854267 20.122 0.366114 19.6339C-0.122042 19.1457 -0.122042 18.3543 0.366114 17.8661L5.17919 13.053C5.22445 13.0078 5.27231 12.9667 5.3223 12.9299ZM5 8.125C5 11.922 8.07804 15 11.875 15C15.672 15 18.75 11.922 18.75 8.125C18.75 4.32804 15.672 1.25 11.875 1.25C8.07804 1.25 5 4.32804 5 8.125Z"
      fill="black"
    />
  </svg>
);

const ArrowUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <g clipPath="url(#clip0_5139_73149)">
      <path
        fill="#110B0D"
        d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_5139_73149">
        <path fill="#fff" d="M0 0h24v24H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
      d="M1 1l18 18M19 1L1 19"
    />
  </svg>
);

export { UserIcon, StarIcon, SearchIcon, ArrowUpIcon, CloseIcon };
