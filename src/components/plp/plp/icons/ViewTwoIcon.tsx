import * as React from "react";

const ViewTwoIcon = ({
  color = "#E6E6E6",
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="44"
    height="44"
    fill="none"
    viewBox="0 0 44 44"
    color={color}
    {...props}
  >
    <rect width="42" height="42" x="1" y="1" fill="#fff" rx="9"></rect>
    <rect
      width="42"
      height="42"
      x="1"
      y="1"
      stroke={color}
      strokeWidth="2"
      rx="9"
    ></rect>
    <rect
      width="10"
      height="22"
      x="10"
      y="11"
      stroke={color}
      strokeWidth="2"
      rx="1"
    ></rect>
    <rect
      width="10"
      height="22"
      x="24"
      y="11"
      stroke={color}
      strokeWidth="2"
      rx="1"
    ></rect>
  </svg>
);

export default ViewTwoIcon;
