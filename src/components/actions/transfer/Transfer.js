import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import Signal from "../../base/Signal"

export default class Transfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("signal", Signal, null, "Signal to start transfer"),
        new Inport("diluted strain", "type", null, "diluted strain")
      ],
      outports: [
        new Outport("measurement sample", "type", "data", "measurement sample"),
      ],
    };
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        inportData={this.props.inportData}
        outports={this.state.outports}
        actionID={this.props.id}
        positionDeltas={this.props.positionDeltas}
      >
        <div className="actionTitle">Transfer</div>
        <div className="actionContent">Content goes here!</div>
      </GenericAction>
    );
  }
}
