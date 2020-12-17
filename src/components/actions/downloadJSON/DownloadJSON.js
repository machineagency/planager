import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import Signal from "../../base/Signal";

export default class DownloadJSON extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("Input", "JSON", null, "The JSON file to be downloaded."),
      ],
      outports: [
        new Outport(
          "Output",
          Signal,
          null,
          "Signal for when download is completed."
        ),
      ],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.payload) return null;

    // This is where data comes in from a link and is assigned to a port
    // This is where you should do anything that should happen when a link is connected
    prevState.inports[0].data = nextProps.payload.data.data;

    return prevState;
  }

  download() {
    if (!this.state.inports[0].data) {
      alert("There's no JSON file to download!");
      return;
    }
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(this.state.inports[0].data.protocol));

    var link = document.createElement("a");

    link.download = "workspace.json";
    link.href = dataStr;
    link.click();
    link.remove();

    let newOutports = [...this.state.outports];
    newOutports[0].data = new Signal("download complete");
    this.setState({ outports: newOutports });
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        outports={this.state.outports}
        actionID={this.props.id}
        positionDeltas={this.props.positionDeltas}
      >
        <div className="actionTitle">Download JSON</div>
        <div className="actionContent">
          <input
            type="button"
            value="Download"
            className="planagerButton"
            onClick={this.download.bind(this)}
          />
        </div>
      </GenericAction>
    );
  }
}
