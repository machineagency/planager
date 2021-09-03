import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import Signal from "../../base/Signal";

export default class FlowCytometryMeasurement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("signal", Signal, null, "Media: Media Type"),
        new Inport("sample", "sample", null, "sample to be measured"),
        new Inport("OD", "Measured OD", null, "The OD that was measured"),
      ],
      outports: [new Outport("Cytometry", "cytometry data", null, "Cytometry")],
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
        <div className="actionContent">
          <div className="colonyContainer">
            <span class="transferLabel">OD:</span>
            <input
              type="text"
              className="colonyInput"
              placeholder="Measured OD"
            />
          </div>
          <div>
            <div className="notesTitle">Notes</div>
            <div className="notesContent">
              96 flat 2 measure on flow quickly
            </div>
          </div>
        </div>
      </GenericAction>
    );
  }
}
