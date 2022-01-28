import React from "react";
import Draggable from "react-draggable";
import ActionConfig from "./ActionConfig";
import ActionToolbar from "./ActionToolBar";
import Inport from "./Inport";
import Outport from "./Outport";

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
  renderInports() {
    let inports = [];
    for (const [inportName, entry] of Object.entries(this.props.inports)) {
      // When creating the ports, we pass through the ref from the parent so
      // that the parent can manage the links between the ports.
      inports.push(
        <Inport
          inportName={inportName}
          key={inportName}
          displayName={entry["displayName"]}
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
    for (const [outportName, entry] of Object.entries(this.props.outports)) {
      // When creating the ports, we pass through the ref from the parent so
      // that the parent can manage the links between the ports.
      outports.push(
        <Outport
          outportName={outportName}
          key={outportName}
          displayName={entry["displayName"]}
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
        handle='.dragHandle'
        defaultPosition={{ x: 100, y: 100 }}
        onDrag={this.props.triggerRender}
        onStop={this.props.triggerRender}>
        <div className='actionGridContainer'>
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
            <div className='ports'>{this.renderInports()}</div>
          </div>
          <div className='mainActionContainer'>
            <ActionToolbar
              displayName={this.props.action.displayName}
              toggleConfig={this.toggleConfig.bind(this)}
            />
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
