import * as React from "react";

const GridHorizontalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
        <path d="M3.5 20.5L3.5 13.5L20.5 13.5V20.5H3.5Z" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3.5 10.5L3.5 3.5L20.5 3.5V10.5L3.5 10.5Z" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
);

const GridVerticalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
        <path d="M3.5 3.5H10.5V10.5H3.5V3.5Z" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3.5 13.5H10.5V20.5H3.5V13.5Z" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13.5 3.5H20.5V10.5H13.5V3.5Z" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13.5 13.5H20.5V20.5H13.5V13.5Z" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
);

const FilterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.83333 7.50001V5.83334H17.5V7.50001H5.83333ZM5.83333 10.8333V9.16668H17.5V10.8333H5.83333ZM5.83333 14.1667V12.5H17.5V14.1667H5.83333ZM3.33333 7.50001C3.09722 7.50001 2.89931 7.42015 2.73958 7.26043C2.57986 7.1007 2.5 6.90279 2.5 6.66668C2.5 6.43057 2.57986 6.23265 2.73958 6.07293C2.89931 5.9132 3.09722 5.83334 3.33333 5.83334C3.56944 5.83334 3.76736 5.9132 3.92708 6.07293C4.08681 6.23265 4.16667 6.43057 4.16667 6.66668C4.16667 6.90279 4.08681 7.1007 3.92708 7.26043C3.76736 7.42015 3.56944 7.50001 3.33333 7.50001ZM3.33333 10.8333C3.09722 10.8333 2.89931 10.7535 2.73958 10.5938C2.57986 10.434 2.5 10.2361 2.5 10C2.5 9.7639 2.57986 9.56598 2.73958 9.40626C2.89931 9.24654 3.09722 9.16668 3.33333 9.16668C3.56944 9.16668 3.76736 9.24654 3.92708 9.40626C4.08681 9.56598 4.16667 9.7639 4.16667 10C4.16667 10.2361 4.08681 10.434 3.92708 10.5938C3.76736 10.7535 3.56944 10.8333 3.33333 10.8333ZM3.33333 14.1667C3.09722 14.1667 2.89931 14.0868 2.73958 13.9271C2.57986 13.7674 2.5 13.5695 2.5 13.3333C2.5 13.0972 2.57986 12.8993 2.73958 12.7396C2.89931 12.5799 3.09722 12.5 3.33333 12.5C3.56944 12.5 3.76736 12.5799 3.92708 12.7396C4.08681 12.8993 4.16667 13.0972 4.16667 13.3333C4.16667 13.5695 4.08681 13.7674 3.92708 13.9271C3.76736 14.0868 3.56944 14.1667 3.33333 14.1667Z" fill="#313131"/>
    </svg>
);




export { GridHorizontalIcon, GridVerticalIcon, FilterIcon  };
