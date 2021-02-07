import React from "react";
import GenericAction from "../GenericAction";
import Outport from "../../base/Outport";
import { ReactSVGPanZoom, TOOL_AUTO } from "react-svg-pan-zoom";
import { ReactSvgPanZoomLoader } from "react-svg-pan-zoom-loader";
import "./SvgLoader.css";

export default class SvgLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outports: [
        new Outport(
          "SVG URL",
          String,
          null,
          "The url to the SVG that was loaded."
        ),
      ],
      svg: null,
      tool: TOOL_AUTO,
      value: {},
    };
  }

  loadSVG(event) {
    const svgurl = window.URL.createObjectURL(event.target.files[0]);
    let outports = [...this.state.outports];
    outports[0].data = svgurl;
    this.setState({ outports: outports, svg: svgurl });
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
        <div className="actionContent" style={{ minWidth: "130px" }}>
          <label title="Load workflow" className="svgLoadButton">
            <div>Upload SVG...</div>
            <input
              type="file"
              accept=".svg"
              onChange={this.loadSVG.bind(this)}
            />
          </label>
          {this.state.svg ? (
            <ReactSvgPanZoomLoader
              src={this.state.svg}
              render={(content) => (
                <ReactSVGPanZoom
                  width={500}
                  height={500}
                  tool={this.state.tool}
                  onChangeTool={(tool) => this.setState({ tool })}
                  value={this.state.value}
                  onChangeValue={(value) => this.setState({ value })}
                >
                  <svg width={500} height={500}>
                    {content}
                  </svg>
                </ReactSVGPanZoom>
              )}
            />
          ) : (
            ""
          )}
        </div>
      </GenericAction>
    );
  }
}
