// Import Libraries
import React from "react";
import Draggable from "react-draggable";

// Import Stylesheet
import "./GenericAction.css";

// Import Components
import PortIn from "../base/PortIn";
import PortOut from "../base/PortOut";

export default class GenericAction extends React.Component {
  state = {
    deltaPosition: {
      x: 0,
      y: 0,
    },
  };

  handleDrag(e, ui) {
    const { x, y } = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      },
    });
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
          deltaPosition={this.state.deltaPosition}
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
          deltaPosition={this.state.deltaPosition}
          id={`${this.props.actionID}_outport_${port.name}`}
        />
      );
    }

    return outportList;
  }

  render() {
    return (
      <Draggable onDrag={this.handleDrag.bind(this)} cancel=".actionContent">
        <div className="action row">
          <div className="column portsContainer">{this.renderInports()}</div>
          <div className="column box">{this.props.children}</div>
          <div className="column portsContainer">{this.renderOutports()}</div>
        </div>
      </Draggable>
    );
  }
}
