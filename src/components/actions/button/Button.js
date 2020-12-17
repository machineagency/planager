import React from "react";
import GenericAction from "../GenericAction";
import Outport from "../../base/Outport";
import Signal from "../../base/Signal";

export default class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          inports: [],
          outports: [
            new Outport("Output", Signal, null, "The data that was displayed."),
          ],
        };
      }

  clicked() {
    let outports = [...this.state.outports];
    outports[0].data = new Signal("click");
    this.setState({ outports: outports });
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        inportData={this.props.inportData}
        outports={this.state.outports}
        actionID={this.props.id}
        positionDeltas={this.props.positionDeltas}
      >
        <div className="actionTitle">Button</div>
        <div className="actionContent">
        <input
            type="button"
            value="Send signal"
            className="planagerButton violet"
            onClick={this.clicked.bind(this)}
          />
        </div>
      </GenericAction>
    );
  }
}
