/** @jsx jsx */
import React from "react";
import ReactDOM from "react-dom";
import "./styles/ports.css";
import GlobalContext from "../../utils/GlobalContext";
import { jsx } from "theme-ui";

export default class PortOut extends React.Component {
  static contextType = GlobalContext;
  portRef = React.createRef();

  componentDidUpdate() {
    const { global } = this.context;
    global.outportUpdatedCallback(
      this.props.id,
      this.props.port,
      this.getCenterPoint(ReactDOM.findDOMNode(this.portRef.current))
    );
  }

  onDragOut(e) {
    const { global } = this.context;
    e.stopPropagation();
    e.persist();
    global.startOutportLink(
      this.props.id,
      this.getCenterPoint(e.target),
      this.props.port
    );
  }

  getCenterPoint(el) {
    // Used for placing the wires correctly
    let rect = el.getBoundingClientRect();
    return {
      y: rect.top + rect.height / 2,
      x: rect.left + rect.width / 2,
    };
  }

  render() {
    return (
      <div>
        <button
          ref={this.portRef}
          className="outport port tooltip"
          onMouseDown={this.onDragOut.bind(this)}
          data-id={this.props.id}
          sx={{
            backgroundColor: "port",
            ":hover": {
              backgroundColor: "portHover",
            },
          }}
        >
          <span className="tooltiptext">
            <b>Name:</b>
            {this.props.port.name}
            <br />
            <b>Type:</b>
            {typeof this.props.port.data}
            <br />
            <b>Description:</b>
            {this.props.port.description}
            <br />
            <b>Data:</b>
            {JSON.stringify(this.props.port.data)}
          </span>
        </button>
      </div>
    );
  }
}
