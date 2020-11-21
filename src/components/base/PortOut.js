import React from "react";
import "./styles/ports.css";
import GlobalContext from "../../utils/GlobalContext";

export default class PortOut extends React.Component {
  static contextType = GlobalContext;
  componentDidUpdate() {
    const { global } = this.context;
    global.outportUpdatedCallback(
      this.props.id,
      this.props.port,
      this.props.deltaPosition
    );
  }

  onDragOut(e) {
    const { global } = this.context;
    e.stopPropagation();
    e.persist();
    global.startOutportLink(
      e,
      this.props.id,
      this.props.deltaPosition,
      this.props.port
    );
  }

  render() {
    return (
      <div>
        <button
          className="outport port tooltip"
          onMouseDown={this.onDragOut.bind(this)}
          data-id={this.props.id}
        >
          <span className="tooltiptext">
            <b>Name:</b>{this.props.port.name}
            <br />
            <b>Type:</b>{typeof this.props.port.data}
            <br />
            <b>Description:</b>{this.props.port.description}
            <br />
            <b>Data:</b>
            {JSON.stringify(this.props.port.data)}
          </span>
        </button>
      </div>
    );
  }
}
