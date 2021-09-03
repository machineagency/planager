import React from "react";
import "./styles/link.css";

export default class Link extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipPosition: {
        x: 0,
        y: 0,
      },
    };
  }

  static getDerivedStateFromProps(nextProps) {
    let x1 = nextProps.startx;
    let y1 = nextProps.starty;
    let x2 = nextProps.endx;
    let y2 = nextProps.endy;

    const state = {
      tooltipPosition: {
        x: (x2 - x1) / 2 + x1,
        y: (y2 - y1) / 2 + y1,
      },
    };

    return state;
  }

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

  render() {
    return (
      <div>
        <svg className="wire">
          <g id="component">
            <path
              className="linkPath"
              fill="none"
              strokeWidth="4"
              d={this.calculateBezier.bind(this)()}
            />
            <g
              className="tooltip"
              transform={`translate(${this.state.tooltipPosition.x},${this.state.tooltipPosition.y})`}
            >
              <rect rx="5" width="100" height="25"></rect>
              <text x="15" y="16">
                Data: {this.props.data ? JSON.stringify(this.props.data.data) : "none"}
              </text>
            </g>
          </g>
        </svg>
      </div>
    );
  }
}
