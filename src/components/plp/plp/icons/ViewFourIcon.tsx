import * as React from "react";

const ViewFourIcon = ({
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
    <rect width="12" height="12" x="9" y="9.5" fill={color} rx="2"></rect>
    <rect width="12" height="12" x="23" y="9.5" fill={color} rx="2"></rect>
    <rect width="12" height="12" x="9" y="22.5" fill={color} rx="2"></rect>
    <rect width="12" height="12" x="23" y="22.5" fill={color} rx="2"></rect>
  </svg>
);

export default ViewFourIcon;
