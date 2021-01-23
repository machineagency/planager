import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import "./pickcolonies.css";

export default class PickColonies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("Signal", "type", null, "start signal"),
        new Inport("Plate", "type", null, "plate"),
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
        <div className="actionContent">
          <div className="colonyContainer">
            <span class="inputLabel">From:</span>
            <input
              type="text"
              className="colonyInput"
              placeholder="YPAD-plate_1"
            />
          </div>
          <div className="colonyContainer">
            <span class="inputLabel">To:</span>
            <input
              type="text"
              className="colonyInput"
              placeholder="96_flat_1"
            />
          </div>
          <div className="colonyContainer">
            <span class="inputLabel">Media:</span>
            <input
              type="text"
              className="colonyInput"
              placeholder="200 uL SC"
            />
          </div>
          <div>
            <div className="notesTitle">Notes</div>
            <div className="notesContent">Take 6 replicates</div>
          </div>
        </div>
      </GenericAction>
    );
  }
}
