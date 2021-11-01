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
    // Runs after the component updates/recieves new props. Checks if the timestamp of the photo has changed before retracing it and adding it to the state. If we don't check this we will get trapped in an infinite loop because this method is called whenever the state updates.
    const oldIm = prevProps.action.inports.raster.value;
    const newIm = this.props.action.inports.raster.value;
    // If there is no existing value in the inport and no new image, return because there is nothing to trace
    if (!oldIm && !newIm) return;
    // If the new timestamp doesn't match the old timestamp or we've set the retrace value to be true, retrace
    if (newIm.timeStamp !== this.state.lastPic || this.state.retrace == true) {
      imagetracer.imageToSVG(
        newIm.pic,
        (traced) => {
          // Callback: once image is traced, send it to the outport
          this.props.sendToOutport(this.props.action.id, {
            svg: traced,
          });
          // Update the state with the SVG and new timestamp and set retrace to false
          this.setState({
            svg: traced,
            lastPic: newIm.timeStamp,
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
