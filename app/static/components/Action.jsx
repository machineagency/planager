import React from "react";
import Draggable from "react-draggable";
import ActionConfig from "./ActionConfig";
import ActionToolbar from "./ActionToolBar";
import Inport from "./Inport";
import Outport from "./Outport";

import "./styles/action.css";
import "./styles/ports.css";

export default class Action extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: false,
      dragging: false,
    };
    this.nodeRef = React.createRef(null);
  }
  toggleConfig() {
    this.setState({ config: !this.state.config });
  }
  onDragStart() {
    this.setState({ dragging: true });
  }
  onDragEnd() {
    this.setState({ dragging: false });
    this.props.triggerRender();
  }
  renderInports() {
    let inports = [];
    for (const [inportName, entry] of Object.entries(
      this.props.action.inports
    )) {
      // When creating the ports, we pass through the ref from the parent so
      // that the parent can manage the links between the ports.
      inports.push(
        <Inport
          inportName={inportName}
          key={inportName}
          description={entry.description}
          displayName={entry.displayName}
          parentID={entry.parentID}
          contents={entry.value}
          connections={entry.connections}
          reference={this.props.inportRefs[inportName]}
          endConnection={(e) =>
            this.props.endConnection(e, this.props.action.id, inportName)
          }
        />
      );
    }
    return inports;
  }
  renderOutports() {
    let outports = [];
    for (const [outportName, entry] of Object.entries(
      this.props.action.outports
    )) {
      // When creating the ports, we pass through the ref from the parent so
      // that the parent can manage the links between the ports.
      outports.push(
        <Outport
          outportName={outportName}
          key={outportName}
          displayName={entry.displayName}
          parentID={entry.parentID}
          contents={entry.value}
          connections={entry.connections}
          reference={this.props.outportRefs[outportName]}
          beginConnection={(e) =>
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
        nodeRef={this.nodeRef}
        handle='.dragHandle'
        defaultPosition={{ x: 100, y: 100 }}
        onStart={this.onDragStart.bind(this)}
        onDrag={this.props.triggerRender}
        onStop={this.onDragEnd.bind(this)}>
        <div className='actionGridContainer' ref={this.nodeRef}>
          <div style={{ gridColumn: 1, gridRow: 1 }}></div>
          <ActionConfig
            configStatus={this.state.config}
            removeAction={this.props.removeAction.bind(
              this,
              this.props.action.id
            )}
          />
          <div style={{ gridColumn: 3, gridRow: 1 }}></div>
          <div className='leftPortsContainer'>
            <div className='leftPorts'>{this.renderInports()}</div>
          </div>
          <div className='mainActionContainer'>
            <ActionToolbar
              displayName={this.props.action.displayName}
              toggleConfig={this.toggleConfig.bind(this)}
            />
            <div className='actionContent unselectable'>
              {React.cloneElement(this.props.children, {
                action: this.props.action,
                dragging: this.state.dragging,
              })}
            </div>
          </div>
          <div className='rightPortsContainer'>
            <div className='rightPorts'>{this.renderOutports()}</div>
          </div>
        </div>
      </Draggable>
    );
  }
}
