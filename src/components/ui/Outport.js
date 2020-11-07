import React from "react";
import { Popup } from "semantic-ui-react";
import "./css/Outport.css";
import GlobalContext from "../../utils/GlobalContext";

export default class Outport extends React.Component {
  static contextType = GlobalContext;
  componentDidUpdate() {
    const { global } = this.context;
    global.outportUpdatedCallback(this.props.id, this.props.data);
  }

  onDragOut(e) {
    const { global } = this.context;
    e.stopPropagation();
    e.persist();
    global.startOutportLink(e, this.props.id);
  }

  render() {
    return (
      <div>
        <Popup
          content={
            `Name: ` +
            this.props.name +
            `\n Value: ` +
            String(this.props.data.value)
          }
          trigger={
            <button
              className="outport"
              onMouseDown={this.onDragOut.bind(this)}
              data-id={this.props.id}
            />
          }
          position="top left"
          basic
          size="mini"
        />
      </div>
    );
  }
}
