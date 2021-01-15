import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";

export default class Agitate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("Media: Media Type", "type", "data", "Media: Media Type")
      ],
      outports: [
        new Outport("Blank Plate", "type", "data", "Blank Plate"),
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
        <div className="actionTitle">Agitate</div>
        <div className="actionContent">Content goes here!</div>
      </GenericAction>
    );
  }
}
