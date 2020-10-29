import React from "react";
import { Popup } from "semantic-ui-react";
import "./css/Outport.css";

export default class Outport extends React.Component {
  onClick() {
    this.props.outportCallback(this.props);
  }

  onDoubleClick() {
    // doubleclick callback
    console.log("doubleclick");
  }

  onDragOut(e) {
    e.stopPropagation();
    console.log("dragging out");
  }

  render() {
    return (
      <>
        <Popup
          content={
            `Name: ` +
            this.props.name +
            `\n Value: ` +
            String(this.props.dataVal.value)
          }
          trigger={
            <button
              className="outport"
              onClick={this.onClick.bind(this)}
              onDoubleClick={this.onDoubleClick.bind(this)}
              onMouseDown={this.onDragOut.bind(this)}
            />
          }
          position="top left"
          basic
          size="mini"
        />
      </>
    );
  }
}
