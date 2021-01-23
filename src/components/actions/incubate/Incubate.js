import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import Signal from "../../base/Signal";
import "./incubate.css";

export default class Incubate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("Object", "type", "data", "Object"),
      ],
      outports: [new Outport("done signal", Signal, null, "done signal")],
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
        <div className="actionContent">
          <div>
            <input type="text" className="incubateInput" placeholder="Time" />
            <span class="addBtn">hours</span>
          </div>
          <div>
            <input
              type="text"
              className="incubateInput"
              placeholder="Temperature"
            />
            <span class="addBtn">C</span>
          </div>
        </div>
      </GenericAction>
    );
  }
}
