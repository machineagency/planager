import React from "react";
import imagetracer from "./imagetracer";

import "./ImageTrace.css";
const PRESETS = [
  "default",
  "posterized1",
  "posterized2",
  "posterized3",
  "curvy",
  "sharp",
  "detailed",
  "smoothed",
  "grayscale",
  "fixedpalette",
  "randomsampling1",
  "randomsampling2",
  "artistic1",
  "artistic2",
  "artistic3",
  "artistic4",
];

export default class ImageTrace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      svg: null,
      lastPic: Date.now(),
      preset: "default",
      retrace: false,
    };
    this.canvas = React.createRef();
  }
  componentDidUpdate(prevProps) {
    // If there's no value in the inport, do nothing
    if (!prevProps.action.inports.raster.value) return;
    // If the new timestamp doesn't match the old timestamp, retrace
    if (
      this.props.action.inports.raster.value.timeStamp !== this.state.lastPic ||
      this.state.retrace == true
    ) {
      imagetracer.imageToSVG(
        this.props.action.inports.raster.value.pic,
        (res) => {
          // Once image is traced, send it to the outport
          this.props.sendToOutport(this.props.action.id, {
            svg: res,
          });
          // Update the state with the SVG and new timestamp
          this.setState({
            svg: res,
            lastPic: this.props.action.inports.raster.value.timeStamp,
            retrace: false,
          });
        },
        this.state.preset
      );
    }
  }
  updatePreset(preset) {
    this.setState({ preset: preset, retrace: true });
  }
  renderPresetDropdown() {
    let dropdown = [];
    for (const preset of PRESETS) {
      dropdown.push(
        <div
          className='dropdownItem'
          key={preset}
          onClick={this.updatePreset.bind(this, preset)}>
          {preset}
        </div>
      );
    }
    return dropdown;
  }
  render() {
    return (
      <div>
        <img src={`data:image/svg+xml;utf8,${this.state.svg}`} />
        <div className='presetDropdown'>
          Current preset: {this.state.preset}
          <div className='dropdownContainer'>{this.renderPresetDropdown()}</div>
        </div>
      </div>
    );
  }
}
