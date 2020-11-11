// Import Libraries
import React from "react";
import Draggable from "react-draggable";

// Import Stylesheet
import "./css/GenericAction.css";

// Import Components
import Inport from "../ui/Inport";
import Outport from "../ui/Outport";

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

    for (let [name, value] of Object.entries(this.props.inports)) {
      inportList = inportList.concat(
        <Inport
          key={name}
          name={name}
          id={`${this.props.actionID}_inport_${name}`}
          deltaPosition={this.state.deltaPosition}
          data={this.props.inportData ? this.props.inportData[name] : {}}
        />
      );
    }

    return inportList;
  }

  renderOutports() {
    if (!this.props.outports) return;
    let outportList = [];

    for (let [name, value] of Object.entries(this.props.outports)) {
      outportList = outportList.concat(
        <Outport
          key={name}
          name={name}
          deltaPosition={this.state.deltaPosition}
          id={`${this.props.actionID}_outport_${name}`}
          data={value}
        />
      );
    }

    return outportList;
  }

  render() {
    return (
      <Draggable onDrag={this.handleDrag.bind(this)}>
        <div className="action row">
          <div className="column portsContainer">{this.renderInports()}</div>
          <div className="column box">{this.props.children}</div>
          <div className="column portsContainer">{this.renderOutports()}</div>
        </div>
      </Draggable>
    );
  }
}
