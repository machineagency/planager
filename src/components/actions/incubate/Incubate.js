import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import Signal from "../../base/Signal"

export default class Incubate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("Temperature", "type", "data", "Temperature"),
        new Inport("Time", "type", "data", "Time"),
        new Inport("Object", "type", "data", "Object")
      ],
      outports: [
        new Outport("done signal", Signal, null, "done signal"),
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
        <div className="actionTitle">Incubate</div>
        <div className="actionContent">Content goes here!</div>
      </GenericAction>
    );
  }
}
