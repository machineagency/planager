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
        <div className="actionTitle">Patch Plate</div>
        <div
          className="actionContent"
          style={{ display: "grid", gridAutoColumns: "min-content" }}
        >
          <input
            type="text"
            className="volumeInput"
            placeholder="volume..."
            style={{ gridColumn: 1, gridRow: 1, width: "150px"}}
          />
          <span className="addBtn" style={{ gridColumn: 2, gridRow: 1, width: "50px"}}>
            uL
          </span>
          <input
            type="text"
            className="volumeInput"
            placeholder="Yeast Innoculum"
            style={{ gridColumnStart: 1, gridColumnEnd: 3, gridRow: 2 }}
          />
        </div>
      </GenericAction>
    );
  }
}
