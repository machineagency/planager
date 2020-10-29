import React from "react";
import { Popup } from "semantic-ui-react";
import "./css/Inport.css";

export default class Inport extends React.Component {
  onClick() {
    this.props.inportCallback(this.props);
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
              className="inport"
              onClick={this.onClick.bind(this)}
              onMouseDown={this.onDragOut.bind(this)}
            />
          }
          position="top right"
          basic
          size="mini"
        />
      </>
    );
  }
}
