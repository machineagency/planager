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
      inports: [new Inport("name", String, SVGURL, "SVG Object URL")],
      svgurl: SVGURL,
      outports: [
        new Outport("name", SVGPathData, null, "SVG PathData object."),
      ],
      path: null,
      parsed: false,
    };
  }

  async componentDidMount() {
    if (!this.state.inports[0].data) {
      return;
    }

    let blob = await fetch(this.state.inports[0].data).then((r) => r.blob());
    let reader = new FileReader();
    reader.onload = (event) => {
      // Extract path data from the svg, convert to a PathData object, and convert to absolute
      const path = new SVGPathData(parse(event.target.result)).toAbs();
      console.log(path.getBounds());
      this.setState({ path: path, parsed: true });
    };
    reader.readAsText(blob);
  }

  parsePath() {
    console.log("hello");
    const pathData = new SVGPathData(this.state.svg);
    console.log(pathData);
  }

  renderSVG() {
    if (!this.state.parsed) return "No SVG loaded!";
    return (
      <div>
        Bounds: {this.state.path.getBounds()}<br />
        Paths: {this.state.path.commands.length}
      </div>
    )
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
