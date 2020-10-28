import React from "react";
import "./css/Link.css";

export default class Link extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iterations: 0,
    }
  }


  render() {
    return (
      <div>
        <svg>
          <line className="link"
            x1={this.props.startx}
            y1={this.props.starty}
            x2={this.props.endx}
            y2={this.props.endy}
          />
        </svg>
      </div>
    );
  }
}
