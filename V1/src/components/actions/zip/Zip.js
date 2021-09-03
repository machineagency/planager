import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";

export default class Zip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("Input A", "any", [], "The data to be zipped."),
        new Inport("Input B", "any", [], "The data to be zipped."),
      ],

      outports: [new Inport("Output", "any", null, "Zipped output.")],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return null;
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        inportData={this.props.inportData}
        outports={this.state.outports}
        actionID={this.props.id}
      >
        <div className="actionTitle">Zip</div>
        <div className="actionContent">
          Zipping {this.state.inports[0].data.length} inputs.
          <br />
          Result: {JSON.stringify(this.state.outports[0].data)}
        </div>
      </GenericAction>
    );
  }
}
