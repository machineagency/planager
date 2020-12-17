import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import Signal from "../../base/Signal";

export default class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport(
          "Input",
          Signal,
          new Signal(),
          "A signal with data to display"
        ),
      ],
      outports: [
        new Outport("Output", Signal, null, "The data that was displayed."),
      ],
      alertQueue: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.payload) return null;
    if (!nextProps.payload.data.data) return null;

    if (
      prevState.inports[0].data.originTime !==
      nextProps.payload.data.data.originTime
    ) {
      prevState.alertQueue = nextProps.payload.data.data.data;
      prevState.inports[0].data = nextProps.payload.data.data;
    }

    return prevState;
  }

  render() {
    if (this.state.alertQueue) {
      alert(this.state.alertQueue);
      this.setState({ alertQueue: null });
    }
    return (
      <GenericAction
        inports={this.state.inports}
        outports={this.state.outports}
        actionID={this.props.id}
        positionDeltas={this.props.positionDeltas}
      >
        <div className="actionTitle">Alert</div>
        <div className="actionContent">
          I will alert when I recieve a signal.
        </div>
      </GenericAction>
    );
  }
}
