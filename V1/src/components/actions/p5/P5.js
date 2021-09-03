import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";

export default class P5 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("name", "type", "data", "description")
      ],
      outports: [
        new Outport("name", "type", "data", "description"),
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
        <div className="actionTitle">p5.js</div>
        <div className="actionContent">Content goes here!</div>
      </GenericAction>
    );
  }
}
