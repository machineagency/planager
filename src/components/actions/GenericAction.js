// Import Libraries
import React from "react";
import Draggable from "react-draggable";

// Import Style
import "./css/GenericAction.css";

// Import Components
import Inport from "../ui/Inport";
import Outport from "../ui/Outport";

export default class GenericAction extends React.Component {
  constructor(props) {
    super(props);

  }

  inportCallback(inport) {
      console.log("Inport was clicked!", inport)
  }

  outportCallback(outport) {
      console.log("Outport was clicked!", outport)
  }

  renderInports() {
    if (!this.props.inports) return;
    let inportList = [];

    for (let [name, value] of Object.entries(this.props.inports)) {
      inportList = inportList.concat(
        <Inport key={name} name={name} dataVal={value} inportCallback={this.inportCallback.bind(this)}/>
      );
    }

    return inportList;
  }

  renderOutports() {
    if (!this.props.outports) return;
    let outports = [];

    Object.entries(this.props.outports).forEach(([name, value]) => {
      outports = outports.concat(
        <Outport key={name} name={name} dataVal={value} outportCallback={this.outportCallback.bind(this)} />
      );
    });

    return outports;
  }

  render() {
    return (
      <Draggable cancel=".portsContainer, .actionInput">
        <div className="action row">
          <div className="column portsContainer">{this.renderInports()}</div>
          <div className="box column">
            <div className="actionTitle">Alert</div>
            <div className="actionContent">{this.props.children}</div>
          </div>
          <div className="column portsContainer">{this.renderOutports()}</div>
        </div>
      </Draggable>
    );
  }
}
