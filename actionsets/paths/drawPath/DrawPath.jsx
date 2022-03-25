import React, { useEffect } from "react";

import "./DrawPath.css";

function SVGPath({ path }) {
  return (
    <svg width='200' height='200' xmlns='http://www.w3.org/2000/svg'>
      <path d={path} />
    </svg>
  );
}

export default function DrawPath({ action }) {
  // useEffect(() => {
  //   for (const point of action.state.path) {
  //     console.log(point);
  //   }
  // }, action.state.path);
  return (
    <div>
      <SVGPath path={action.state.path} />
    </div>
  );
}
