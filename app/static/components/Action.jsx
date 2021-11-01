import React from "react";
import Draggable from "react-draggable";
import { FaPlay, FaGripVertical } from "react-icons/fa";

import "./styles/action.css";

export default class Action extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "There's nothing here!",
      linking: false,
    };
  }
  renderInports() {
    let inports = [];
    for (const [inportName, entry] of Object.entries(this.props.inports)) {
      inports.push(
        <div
          key={inportName}
          title={entry["displayName"]}
          className='port leftPort'
          onClick={(e) =>
            this.props.endConnection(e, this.props.action.id, inportName)
          }
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
          onClick={(e) =>
            this.props.beginConnection(e, this.props.action.id, outportName)
          }
        />
      );
    }
    return outports;
  }
  getOutportCoords() {
    console.log(this.props.action);
    return {
      x: 1000,
      y: 1000,
    };
  }
  run() {
    fetch("/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.props.action.id),
    })
      .then((response) => response.json())
      .then((res) => this.setState({ content: res.text }));
  }
  render() {
    return (
      <Draggable handle='.dragHandle' defaultPosition={{ x: 100, y: 100 }}>
        <div className='actionGridContainer'>
          <div className='leftPortsContainer'>
            <div className='ports'>{this.renderInports()}</div>
          </div>
          <div className='mainActionContainer'>
            <div className='actionToolbarContainer unselectable'>
              <span className='actionTitle'>
                {this.props.action.displayName}
              </span>
              <span className='dragHandle'>
                <FaGripVertical />
              </span>
            </div>
            <div className='actionContent unselectable'>
              {/* {this.state.content} */}
              {this.props.children}
            </div>
          </div>
          <div className='rightPortsContainer'>
            <div className='ports'>{this.renderOutports()}</div>
          </div>
        </div>
      </Draggable>
    );
  }
}
