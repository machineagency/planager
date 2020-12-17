import React from "react";
import GenericAction from "../GenericAction";
import Outport from "../../base/Outport";

export default class InputJSON extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [],
      outports: [
        new Outport("json output", "json", null, "the JSON that was input"),
      ],
    };
  }

  onDataEntry(event) {
    // TODO: check if valid JSON
    let newOutports = this.state.outports;
    newOutports[0].data = event.target.value;
    this.setState({ outports: newOutports });
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
        <div className="actionTitle">Input JSON</div>
        <div className="actionContent">
          <textarea
            onChange={this.onDataEntry.bind(this)}
            placeholder="Paste JSON here."
          ></textarea>
        </div>
      </GenericAction>
    );
  }
}
