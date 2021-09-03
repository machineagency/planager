import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import { SVGPathData } from "svg-pathdata";

export default class Toolpath extends React.Component {
  constructor(props) {
    super(props);
    const path = this.props.payload.data.data;

    this.state = {
      path: path,
      inports: [new Inport("Path", "type", null, "Input path")],
      outports: [new Outport("name", "type", "data", "description")],
    };
  }

  renderToolPath() {
    if (!this.state.path) return;
    let path = [];
    let current = { x: 0, y: 0 };
    for (const command of this.state.path.commands) {
      switch (command.type) {
        case SVGPathData.LINE_TO:
          path.push(
            <line
              x1={current.x}
              y1={current.y}
              x2={command.x}
              y2={command.y}
              stroke="black"
              strokeWidth="0.2"
            />
          );
          current.x = command.x;
          current.y = command.y;
          break;
        case SVGPathData.MOVE_TO:
          path.push(
            <line
              x1={current.x}
              y1={current.y}
              x2={command.x}
              y2={command.y}
              stroke="red"
              strokeWidth="0.2"
            />
          );
          current.x = command.x;
          current.y = command.y;
          break;
        default:
          console.log("pass");
      }
    }
    return path;
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
        <div className="actionTitle">Toolpath</div>
        <div className="actionContent">
          <div style={{ width: "500px" }}>
            <svg viewBox="0 0 100 100">
                {this.renderToolPath()}
            </svg>
          </div>
        </div>
      </GenericAction>
    );
  }
}
