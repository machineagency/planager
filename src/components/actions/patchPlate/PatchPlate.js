import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import "./patchplate.css";

export default class PatchPlate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("Yeast Innoculum", "type", null, "Yeast Innoculum"),
        new Inport("Volume", "type", null, "volume"),
        new Inport("blank plate", "type", null, "blank plate"),
      ],
      outports: [new Outport("Growth Plate", "type", null, "Growth Plate")],
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
        <div className="actionTitle">Streak</div>
        <div className="actionContent">
          <div>
            <input
              type="text"
              className="volumeInput"
              placeholder="volume..."
            />
            <span class="addBtn">uL</span>
          </div>
          <div>
            <input
              type="text"
              className="volumeInput"
              placeholder="Yeast Innoculum"
            />
          </div>
        </div>
      </GenericAction>
    );
  }
}
