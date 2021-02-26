import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";

export default class ProtocolViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [new Inport("Protocols", Array, null, "an array of protocols")],
      outports: [
        new Outport("Protocols", Array, null, "an array of protocols"),
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
    const protocolArray = this.state.inports[0].data[0];
    for (const protocol of protocolArray) {
      steps.push(
        <div>
          Sonicate {protocol.protocol.length} samples.
        </div>
      )
    }
    return steps;
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        outports={this.state.outports}
        actionID={this.props.id}
        positionDeltas={this.props.positionDeltas}
      >
        <div className="actionTitle">Protocol Viewer</div>
        <div className="actionContent" style={{padding: "10px"}}>
          {this.state.inports[0].data ? this.formatSteps.bind(this)() : "No protocol created"}
        </div>
      </GenericAction>
    );
  }
}
