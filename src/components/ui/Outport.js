import React from "react";
import { Popup } from "semantic-ui-react";
import "./css/Outport.css";
import GlobalContext from "../../utils/GlobalContext";

export default class Outport extends React.Component {
  static contextType = GlobalContext;

  onClick() {
    this.props.outportCallback(this.props);
  }

  onDragOut(e) {
    const { global } = this.context;
    e.stopPropagation();
    e.persist();
    global.startOutportLink(e, this.props.id);
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
              onMouseDown={this.onDragOut.bind(this)}
              data-id={this.props.id}
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
