import React from "react";
import "./styles/link.css";

export default function Link({ startX, startY, endX, endY, removeLink, id }) {
  const linkPath = React.useRef(null);
  let [hovering, setHovering] = React.useState(false);

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
        <path
          className='backgroundPath'
          d={calculateBezier()}
          onMouseOver={() => setHovering(true)}
          onMouseOut={() => setHovering(false)}
        />
        <path
          id='wirePath'
          ref={linkPath}
          className='linkPath'
          d={calculateBezier()}
          onContextMenu={remove}
        />
        <circle id='droplet'>
          <animateMotion
            dur='2s'
            repeatCount='indefinite'
            calcMode='spline'
            keySplines='0.4 0 0.2 1'
            keyTimes='0; 1'>
            <mpath xlinkHref='#wirePath' />
          </animateMotion>
          <animate
            attributeType='XML'
            attributeName='fill'
            from='#2aa198'
            to='#6c71c4'
            dur='2s'
            repeatCount='indefinite'
          />
        </circle>
      </svg>
    </div>
  );
}
