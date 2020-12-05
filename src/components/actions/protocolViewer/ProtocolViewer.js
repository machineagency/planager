import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";

export default class ProtocolViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [new Inport("Input", "any", null, "The data to be displayed.")],
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

  formatSteps() {
    let steps = [];
    const protocol = this.state.inports[0].data.protocol.protocol;
    for (let step = 0; step < protocol.length; step++) {
      steps.push(
        <div key={step}>
          <span>{`${step}. Sonicate well ${protocol[step].specs.row_letter}${step+1}\n`}</span>
        </div>
      );
    }
    return steps;
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        outports={this.state.outports}
        actionID={this.props.id}
      >
        <div className="actionTitle">Protocol Viewer</div>
        <div className="actionContent">
          {this.state.inports[0].data ? this.formatSteps.bind(this)() : "Empty"}
        </div>
      </GenericAction>
    );
  }
}
