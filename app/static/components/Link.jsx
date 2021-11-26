import React from "react";
import "./styles/link.css";

export default class Link extends React.Component {
  calculateBezier() {
    let x1 = this.props.startx;
    let y1 = this.props.starty;
    let x2 = this.props.endx;
    let y2 = this.props.endy;

    return `M${x1},${y1}
    C${x1 + 100},${y1}
    ${x2 - 100},${y2}
    ${x2},${y2}`;
  }
  remove(e) {
    e.preventDefault();
    this.props.removeLink(this.props.id);
  }
  render() {
    return (
      <div>
        <svg className='wire'>
          <g id='component'>
            <path
              className='linkPath'
              fill='none'
              strokeWidth='2'
              d={this.calculateBezier.bind(this)()}
              onContextMenu={this.remove.bind(this)}
            />
          </g>
        </svg>
      </div>
    );
  }
}
