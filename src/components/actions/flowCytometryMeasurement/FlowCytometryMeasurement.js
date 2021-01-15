import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import Signal from "../../base/Signal"

export default class FlowCytometryMeasurement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("signal", Signal, null, "Media: Media Type"),
        new Inport("sample", "sample", null, "sample to be measured")
      ],
      outports: [
        new Outport("Cytometry", "cytometry data", null, "Cytometry"),
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
        <div className="actionTitle">FlowCytometryMeasurement</div>
        <div className="actionContent">Content goes here!</div>
      </GenericAction>
    );
  }
}
