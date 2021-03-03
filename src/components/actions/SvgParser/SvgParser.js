import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import { SVGPathData } from "svg-pathdata";
import { parse } from "extract-svg-path";

export default class SvgParser extends React.Component {
  constructor(props) {
    super(props);
    const SVGURL = this.props.payload.data.data;

    this.state = {
      inports: [new Inport("SVG Object URL", String, SVGURL, "SVG Object URL")],
      svgurl: SVGURL,
      outports: [
        new Outport(
          "SVG PathData object",
          SVGPathData,
          null,
          "SVG PathData object."
        ),
      ],
      path: null,
      parsed: false,
    };
  }

  scale(path) {
    console.log(path.getBounds().maxX, path.getBounds().maxY);

    const xbounds = path.getBounds().maxX / 100;
    const ybounds = path.getBounds().maxY / 100;

    let factor = xbounds > ybounds ? xbounds : ybounds;

    if (ybounds > xbounds) {
      for (const command of path.commands) {
        // command.x = (command.x / factor) * (xbounds / ybounds);
        // command.y = command.y / factor;
        command.x = (command.x / factor) //* (xbounds / ybounds);
        command.y = command.y / factor;
      }
    } else {
      for (const command of path.commands) {
        command.x = command.x / factor;
        command.y = (command.y / factor) //* (xbounds / ybounds);
      }
    }
    return path;
  }

  async componentDidMount() {
    if (!this.state.inports[0].data) return;

    let blob = await fetch(this.state.inports[0].data).then((r) => r.blob());
    let reader = new FileReader();

    reader.onload = (event) => {
      // Extract path data from the svg, convert to a PathData object,
      // convert to absolute, and store the result in the state.
      const path = new SVGPathData(parse(event.target.result)).toAbs();
      const scaled = this.scale(path);
      // const scaled = path;

      let newOutports = [...this.state.outports];
      newOutports[0].data = scaled;
      this.setState({ path: scaled, parsed: true, outports: newOutports });
    };

    reader.readAsText(blob);
  }

  renderSVG() {
    if (!this.state.parsed) return "No SVG loaded!";
    return (
      <div>
        Bounds: {Math.ceil(this.state.path.getBounds().maxX)} by{" "}
        {Math.ceil(this.state.path.getBounds().maxY)} <br />
        Commands: {this.state.path.commands.length}
      </div>
    );
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
        <div className="actionTitle">SVG parser</div>
        <div className="actionContent">{this.renderSVG.bind(this)()}</div>
      </GenericAction>
    );
  }
}
