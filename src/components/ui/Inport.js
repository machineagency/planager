import React from "react";
import { Popup } from "semantic-ui-react";
import "./css/Inport.css";
import GlobalContext from "../../utils/GlobalContext";

export default class Inport extends React.Component {
  static contextType = GlobalContext;
  onDragOut(e) {
    const { global } = this.context;
    e.stopPropagation();
    e.persist();
    global.startInportLink(e, this.props.id);
  }

  render() {
    return (
      <>
        <Popup
          content={
            `Name: ` +
            this.props.name +
            `\n Value: ` +
            String(this.props.data.value)
          }
          trigger={
            <button
              className="inport"
              onMouseDown={this.onDragOut.bind(this)}
              data-id={this.props.id}
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
