import React from "react";

import "./DrawSVG.css";

const OPTIONS = {
  speed_pendown: 25,
  speed_penup: 75,
  accel: 75,
  pen_pos_down: 40,
  pen_pos_up: 60,
  pen_rate_lower: 50,
  pen_rate_raise: 75,
  pen_delay_down: 0,
  pen_delay_up: 0,
  const_speed: false,
  model: 2,
  reordering: 2,
  rendering: 3,
};

export default class DrawSVG extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: OPTIONS,
    };
  }
  draw() {
    fetch("/runBackendMethod", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "draw",
        actionID: this.props.action.id,
        args: { options: this.state.options },
        args: {},
      }),
    })
      .then((res) => res.json())
      .then((plan) => {
        console.log(plan);
      });
  }
  render() {
    return (
      <div>
        <div>
          <img
            width='200px'
            src={`data:image/svg+xml;utf8,${this.props.action.inports.svg.value}`}
          />
        </div>
        <div className='drawButton' onClick={this.draw.bind(this)}>
          Draw!
        </div>
      </div>
    );
  }
}
