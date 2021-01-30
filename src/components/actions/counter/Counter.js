import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Signal from "../../base/Signal";
import Outport from "../../base/Outport";

export default class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("Signal input", Signal, new Signal(), "a signal object"),
      ],
      outports: [new Outport("Output", Number, 0, "A count of signals.")],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.payload) return null;
    if (!nextProps.payload.data.data) return null;

    if (
      prevState.inports[0].data.originTime !==
      nextProps.payload.data.data.originTime
    ) {
      prevState.outports[0].data += 1;
      prevState.inports[0].data = nextProps.payload.data.data;
    }

    return prevState;
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
        <div className="actionTitle">Counter</div>
        <div
          className="actionContent"
          style={{ maxWidth: "175px", padding: "10px", fontSize: "20px" }}
        >
          <center><b>{this.state.outports[0].data}</b></center>
        </div>
      </GenericAction>
    );
  }
}
