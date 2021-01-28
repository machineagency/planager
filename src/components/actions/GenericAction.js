// Import Libraries
import React from "react";
import Draggable from "react-draggable";
import { VscClose } from "react-icons/vsc";

// Import Stylesheet
import "./GenericAction.css";

// Import Components
import PortIn from "../base/PortIn";
import PortOut from "../base/PortOut";

import GlobalContext from "../../utils/GlobalContext";

export default class GenericAction extends React.Component {
  static contextType = GlobalContext;

  state = {
    deltaPosition: {
      x: 0,
      y: 0,
    },
  };

  handleDrag(e, ui) {
    const { global } = this.context;
    const { x, y } = this.props.positionDeltas;

    let newPositionDeltas = {
      x: x + ui.deltaX,
      y: y + ui.deltaY,
    };

    global.actionPositionCallback(newPositionDeltas, this.props.actionID);
  }

  renderInports() {
    if (!this.props.inports) return;
    let inportList = [];

    for (const port of this.props.inports) {
      inportList = inportList.concat(
        <PortIn
          key={port.name}
          port={port}
          id={`${this.props.actionID}_inport_${port.name}`}
          deltaPosition={this.props.positionDeltas}
        />
      );
    }

    return inportList;
  }

  renderOutports() {
    if (!this.props.outports) return;
    let outportList = [];

    for (const port of this.props.outports) {
      outportList = outportList.concat(
        <PortOut
          key={port.name}
          port={port}
          deltaPosition={this.props.positionDeltas}
          id={`${this.props.actionID}_outport_${port.name}`}
        />
      );
    }

    return outportList;
  }

  removeAction() {
    const { global } = this.context;

    global.removeAction(this.props.actionID);
  }

  render() {
    return (
      <Draggable
        onDrag={this.handleDrag.bind(this)}
        cancel=".actionContent"
        defaultPosition={this.props.positionDeltas}
      >
        <div>
          <div className="actionGridContainer">
            {/* Put any generic action buttons in the toolbar container */}
            <div className="toolbarContainer">
              <span
                onClick={this.removeAction.bind(this)}
                className="removeActionButton"
                title="Remove action"
              >
                <VscClose className="closeIcon" />
              </span>
            </div>
            <div className="leftPortsContainer">
              <div className="leftPorts">{this.renderInports()}</div>
            </div>
            <div className="mainActionContainer">
              <div className="mainAction">{this.props.children}</div>
            </div>
            <div className="rightPortsContainer">
              <div className="rightPorts">{this.renderOutports()}</div>
            </div>
          </div>
        </div>
      </Draggable>
    );
  }
}
