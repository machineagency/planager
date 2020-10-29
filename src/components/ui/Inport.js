import React from "react";
import ReactTooltip from "react-tooltip";
import "./css/Inport.css";

export default class Inport extends React.Component {
  onClick() {
    this.props.inportCallback(this.props);
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
          className="inport"
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
