import React from "react";
import Draggable from "react-draggable";
import { FaSlidersH, FaGripVertical } from "react-icons/fa";

import "./styles/action.css";

export default class Action extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      computed: {},
      content: "There's nothing here!",
      linking: false,
      config: false,
    };
  }
  toggleConfig() {
    this.setState({ config: !this.state.config });
  }
  renderConfig() {
    return (
      <div id='config'>
        <div
          id='removeActionButton'
          type='button'
          onClick={this.props.removeAction.bind(this, this.props.action.id)}>
          Remove Action
        </div>
        <div></div>
      </div>
    );
  }
  renderInports() {
    let inports = [];
    for (const [inportName, entry] of Object.entries(this.props.inports)) {
      // When creating the ports, we pass through the ref from the parent so
      // that the parent can manage the links between the ports.
      inports.push(
        <div
          ref={this.props.inportRefs[inportName]}
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
      // When creating the ports, we pass through the ref from the parent so
      // that the parent can manage the links between the ports.
      outports.push(
        <div
          ref={this.props.outportRefs[outportName]}
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
  render() {
    return (
      <Draggable
        handle='.dragHandle'
        defaultPosition={{ x: 100, y: 100 }}
        onDrag={this.props.triggerRender}
        onStop={this.props.triggerRender}>
        <div className='actionGridContainer'>
          <div style={{ gridColumn: 1, gridRow: 1 }}></div>
          <div
            id='configContainer'
            style={{ display: this.state.config ? "block" : "none" }}>
            {this.renderConfig()}
          </div>
          <div style={{ gridColumn: 3, gridRow: 1 }}></div>
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
              <span
                className='configButton'
                title='Open config panel'
                onClick={this.toggleConfig.bind(this)}>
                <FaSlidersH />
              </span>
            </div>
            <div className='actionContent unselectable'>
              {React.cloneElement(this.props.children, {
                action: this.props.action,
                inports: this.props.inports,
                outports: this.props.outports,
              })}
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
