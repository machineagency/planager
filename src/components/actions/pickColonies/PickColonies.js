import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";

export default class PickColonies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("Signal", "type", null, "start signal"),
        new Inport("Plate", "type", null, "plate"),
        new Inport("Media", "type", "data", "Media")
      ],
      outports: [
        new Outport("strain in media", "type", null, "strain in media"),
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
        <div className="actionTitle">PickColonies</div>
        <div className="actionContent">Content goes here!</div>
      </GenericAction>
    );
  }
}
