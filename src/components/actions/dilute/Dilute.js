import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import "./Dilute.css";

export default class Dilute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
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
        <div
          className="actionContent"
          style={{ display: "grid", gridAutoColumns: "min-content" }}
        >
          <span className="diluteLabel" style={{ gridColumn: 1, gridRow: 1 }}>
            Input OD:
          </span>
          <input
            type="text"
            className="colonyInput"
            placeholder="input OD"
            style={{ gridColumn: 2, gridRow: 1 }}
          />
          <span className="diluteLabel" style={{ gridColumn: 1, gridRow: 2 }}>
            Target OD:
          </span>
          <input
            type="text"
            className="colonyInput"
            placeholder="target OD"
            style={{ gridColumn: 2, gridRow: 2 }}
          />
          <span className="diluteLabel" style={{ gridColumn: 1, gridRow: 3 }}>
            Media:
          </span>
          <input
            type="text"
            className="colonyInput"
            placeholder="Media"
            style={{ gridColumn: 2, gridRow: 3 }}
          />
          <div className="notesTitle" style={{ gridColumnStart: 1, gridColumnEnd: 3, gridRow: 4 }}>Notes</div>
          <div className="notesContent" style={{ gridColumnStart: 1, gridColumnEnd: 3, gridRow: 5 }}>
            96 flat 1 dilute (at constant volume (TX), OD defined average volume
            (BF), OD defined well volume (GB) trying to hit about OD 600 0.0003,
            0.00015, 0.000075) into 96 deep 1 with 1mL SC media
          </div>
        </div>
      </GenericAction>
    );
  }
}
