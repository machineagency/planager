import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";

export default class SvgLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [new Inport("name", "type", "data", "description")],
      outports: [new Outport("SVG file", "SVG", "data", "description")],
      svg: null,
    };
  }

  loadSVG(event) {
    var reader = new FileReader();

    // This callback is run when the file loads
    reader.onload = (event) => {
      this.setState({ svg: event.target.result });
    };

    reader.readAsText(event.target.files[0]);
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
        <div className="actionTitle">SVG Loader</div>
        <div className="actionContent">
          <label
            className="toolbarButton"
            title="Load workflow"
            sx={{
              ":hover": {
                backgroundColor: "toolbarText",
                color: "toolbar",
              },
            }}
          >
            <span>Upload SVG</span>
            <input
              type="file"
              name="resume"
              onChange={this.loadSVG.bind(this)}
            />
          </label>
          <br />
          {this.state.svg ? (
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 640 480"
              preserveAspectRatio="xMaxYMax"
              dangerouslySetInnerHTML={{ __html: this.state.svg }}
            />
          ) : (
            <br />
          )}
        </div>
      </GenericAction>
    );
  }
}
