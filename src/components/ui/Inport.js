import React from "react";
import ReactTooltip from "react-tooltip";
import "./css/Inport.css";

export default class Inport extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onClick(event) {
    console.log(this.props.name);
  }

  onDragStart(event) {
    console.log("drag start");
  }

  onDragEnd(event) {
    console.log("drag end");
  }

  render() {
    return (
      <div>
        <ReactTooltip />
        <button
          className="inport"
          onClick={this.onClick}
          data-tip={this.props.name}
        />
      </div>
    );
  }
}
