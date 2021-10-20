import React from "react";
import Draggable from "react-draggable";
import { FaPlay } from "react-icons/fa";

import "./styles/action.css";

export default class Action extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   action: null,
    // };
  }
  renderInports() {
    let inports = [];
    for (const [inportName, entry] of Object.entries(this.props.inports)) {
      inports.push(
        <div
          key={inportName}
          title={entry["displayName"]}
          className='port leftPort'
        />
      );
    }
    return inports;
  }
  renderOutports() {
    let outports = [];
    for (const [outportName, entry] of Object.entries(this.props.outports)) {
      outports.push(
        <div
          key={outportName}
          title={entry["displayName"]}
          className='port rightPort'
        />
      );
    }
    return outports;
  }
  handleDrag(e, ui) {
    // TODO: When should we send the new coords to the backend? On save?
    const { x, y } = this.props.coords;

    const newPositionDeltas = {
      x: x + ui.deltaX,
      y: y + ui.deltaY,
    };

    // fetch("/updateCoords", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(newPositionDeltas),
    // });
  }
  run() {
    fetch("/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.props.action),
    })
      .then((response) => response.json())
      .then((res) => console.log(res));
  }
  render() {
    return (
      <Draggable
        onStop={this.handleDrag.bind(this)}
        cancel='.actionContent .leftPortsContainer .rightPortsContainer'
        defaultPosition={{ x: 100, y: 100 }}>
        <div className='actionGridContainer'>
          <div className='leftPortsContainer'>
            <div className='leftPorts'>{this.renderInports()}</div>
          </div>
          <div className='mainActionContainer'>
            <div className='actionToolbarContainer'>
              <span className='actionTitle'>
                {this.props.action.displayName}
              </span>
              <span className='runIcon' onClick={this.run.bind(this)}>
                <FaPlay />
              </span>
            </div>
            <div className='actionContent'>this is the action content</div>
          </div>
          <div className='rightPortsContainer'>
            <div className='rightPorts'>{this.renderOutports()}</div>
          </div>
        </div>
      </Draggable>
    );
  }
}
