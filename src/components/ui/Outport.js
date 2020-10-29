import React from "react";
import ReactTooltip from "react-tooltip";
import "./css/Outport.css";

export default class Outport extends React.Component {
  onClick() {
    this.props.outportCallback(this.props);
  }

  onDoubleClick() {
    // doubleclick callback
    console.log("doubleclick")
  }

  render() {
    return (
      <>
        <ReactTooltip />
        <button
          className="outport"
          data-tip={
            `Name: ` +
            this.props.name +
            `\n Value: ` +
            String(this.props.dataVal.value)
          }
          onClick={this.onClick.bind(this)}
          onDoubleClick={this.onDoubleClick.bind(this)}
        />
      </>
    );
  }
}
