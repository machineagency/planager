import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import "./provision.css";

export default class ProvisionPlate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("Media: Media Type", "type", null, "Media: Media Type"),
      ],
      outports: [new Outport("Blank Plate", "plate", null, "Blank Plate")],
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
        <div className="actionTitle">Provision</div>
        <div className="actionContent">
          <div class="header">
            <input type="text" className="provisionInput" placeholder="Add item..." />
            <span onclick="newElement()" class="addBtn">
              Add
            </span>
          </div>
          <ul className="provisionlist">
            <li className="checked">YPAD-plate_1</li>
            <li className="checked">Growth Plate</li>
            <li className="checked">96_flat_1</li>
            <li className="checked">96 deep</li>
          </ul>
        </div>
      </GenericAction>
    );
  }
}
