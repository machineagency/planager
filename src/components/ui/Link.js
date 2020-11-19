import React from "react";
import "./css/Link.css";

export default class Link extends React.Component {
  calculateBezier() {
    let x1 = this.props.startx + this.props.deltastartx;
    let y1 = this.props.starty + this.props.deltastarty;
    let x2 = this.props.endx + this.props.deltaendx;
    let y2 = this.props.endy + this.props.deltaendy;
    return `M${x1},${y1} 
    C${x1 + 100},${y1} 
    ${x2 - 100},${y2}
    ${x2},${y2}`;
  }

  render() {
    return (
      <div>
        <svg>
          <path
            stroke="lightgray"
            fill="none"
            strokeWidth="2"
            d={this.calculateBezier.bind(this)()}
          />
        </svg>
      </div>
    );
  }
}
