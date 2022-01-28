import React from "react";
import "./styles/link.css";

export default function Link({ startX, startY, endX, endY, removeLink, id }) {
  function calculateBezier() {
    return `M${startX},${startY}
      C${startX + 100},${startY}
      ${endX - 100},${endY}
      ${endX},${endY}`;
  }
  function remove(e) {
    e.preventDefault();
    removeLink(id);
  }
  return (
    <div>
      <svg className='wire'>
        <g id='component'>
          <path
            className='linkPath'
            fill='none'
            strokeWidth='2'
            d={calculateBezier()}
            onContextMenu={remove}
          />
        </g>
      </svg>
    </div>
  );
}
