import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import Signal from "../../base/Signal";

export default class MeasureOD extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("start signal", Signal, null, "start signal"),
        new Inport("sample", "sample", null, "sample"),
      ],
      outports: [
        new Outport("OD measurement", "type", null, "measurement"),
        new Outport("signal", Signal, null, "signal when finished"),
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
        <div className="actionTitle">MeasureOD</div>
        <div className="actionContent">
          <div style={{padding: "10px", maxWidth: "250px"}}>
            96 flat 1 measure OD600 - OD conversion determined cellometer or
            flow cytometer
          </div>
        </div>
      </GenericAction>
    );
  }
}
