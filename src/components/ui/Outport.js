import React from "react";
import "./css/ports.css";
import GlobalContext from "../../utils/GlobalContext";

export default class Outport extends React.Component {
  static contextType = GlobalContext;
  componentDidUpdate() {
    const { global } = this.context;
    global.outportUpdatedCallback(
      this.props.id,
      this.props.data,
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
      this.props.data
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
            <b>{this.props.name}</b>
            <br />
            {JSON.stringify(this.props.data)}
          </span>
        </button>
      </div>
    );
  }
}
