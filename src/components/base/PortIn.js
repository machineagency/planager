import React from "react";
import "./styles/ports.css";
import GlobalContext from "../../utils/GlobalContext";

export default class PortIn extends React.Component {
  static contextType = GlobalContext;
  componentDidUpdate() {
    const { global } = this.context;
    global.inportUpdatedCallback(this.props.id, this.props.deltaPosition);
  }

  onDragOut(e) {
    const { global } = this.context;
    e.stopPropagation();
    e.persist();
    global.startInportLink(e, this.props.id, this.props.deltaPosition);
  }

  render() {
    return (
      <div>
        <button
          className="inport port tooltip"
          onMouseDown={this.onDragOut.bind(this)}
          data-id={this.props.id}
        >
          <span className="tooltiptext">
            <b>{this.props.name}</b>
            <br />
            {JSON.stringify(this.props.data ? this.props.data.value : {})}
          </span>
        </button>
      </div>
    );
  }
}
