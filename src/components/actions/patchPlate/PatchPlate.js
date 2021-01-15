import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";

export default class PatchPlate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("Yeast Innoculum", "type", null, "Yeast Innoculum"),
        new Inport("Volume", "type", null, "volume"),
        new Inport("blank plate", "type", null, "blank plate"),
      ],
      outports: [
        new Outport("Growth Plate", "type", null, "Growth Plate"),
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
        <div className="actionTitle">PatchPlate</div>
        <div className="actionContent">Content goes here!</div>
      </GenericAction>
    );
  }
}
