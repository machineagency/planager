import React from "react";

import "./Options.css";

export default class Options extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speed_pendown: 25,
      speed_penup: 75,
      accel: 75,
      pen_pos_down: 40,
      pen_pos_up: 60,
      pen_rate_lower: 50,
      pen_rate_raise: 75,
      pen_delay_down: 0,
      pen_delay_up: 0,
      model: 2,
      reordering: 2,
    };
    this.props.sendToOutport(this.props.action.id, {
      options: this.state,
    });
  }
  updateOption(option, value) {
    this.props.sendToOutport(this.props.action.id, {
      options: this.state,
    });
  }
  renderOptions() {
    let options = [];
    for (const [option, value] of Object.entries(this.state)) {
      options.push(
        <div key={option} className='option'>
          {option}: {value}
        </div>
      );
    }
    return options;
  }
  render() {
    return (
      <div>
        <div id='controlPanel'>{this.renderOptions()}</div>
      </div>
    );
  }
}
