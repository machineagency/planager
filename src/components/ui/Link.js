import React from "react";
import "./css/Link.css";

export default class Link extends React.Component {
  render() {
    return (
      <div>
        <svg>
          <path
            stroke="gray"
            fill="none"
            strokeWidth="5"
            d={`M${this.props.startx},${this.props.starty} 
              C${this.props.startx + 100},${this.props.starty} 
              ${this.props.endx - 100},${this.props.endy}
              ${this.props.endx},${this.props.endy}`}
          />
        </svg>
      </div>
    );
  }
}
