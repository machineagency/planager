import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";

export default class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("Input", "any", null, "The data to be displayed.")
      ],
      outports: [
        new Outport("Output", "any", null, "The data that was displayed."),
      ],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.payload) return null;

    // This is where data comes in from a link and is assigned to a port
    // This is where you should do anything that should happen when a link is connected
    prevState.inports[0].data = nextProps.payload.data.data;
    prevState.outports[0].data = nextProps.payload.data.data;

    return prevState;
  }

  run() {
    alert(`Value: ${this.state.inports[0].data}`);
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        outports={this.state.outports}
        actionID={this.props.id}
      >
        <div className="actionTitle">Alert</div>
        <div className="actionContent">
          <input
            type="button"
            value="Click me!"
            className="planagerButton"
            onClick={this.run.bind(this)}
          />
        </div>
      </GenericAction>
    );
  }
}
