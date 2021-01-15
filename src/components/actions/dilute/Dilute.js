import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";

export default class Dilute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("Media", "type", "data", "Medi"),
        new Inport("input OD", "type", "data", "input OD"),
        new Inport("target OD", "type", "data", "target OD"),
        new Inport("strain in media", "type", "data", "strain in media"),
      ],
      outports: [
        new Outport("diluted strain", "type", "data", "diluted strain"),
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
        <div className="actionTitle">Dilute</div>
        <div className="actionContent">Content goes here!</div>
      </GenericAction>
    );
  }
}
