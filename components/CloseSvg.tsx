import React from "react";

function CloseSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path
        fill="none"
        stroke="var(--primary)"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeWidth="32"
        d="M368 368L144 144M368 144L144 368"
      />
    </svg>
  );
}

export default CloseSvg;
