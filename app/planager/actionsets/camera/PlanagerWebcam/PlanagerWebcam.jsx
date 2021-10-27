import React from "react";
import Webcam from "react-webcam";

import "./PlanagerWebcam.css";

const videoConstraints = {
  width: 640,
  height: 360,
  facingMode: "user",
};

export default class PlanagerWebcam extends React.Component {
  constructor(props) {
    super(props);
    this.camera = React.createRef();
  }
  screenshot() {
    const pic = this.camera.current.getScreenshot();
    this.props.sendToOutport(this.props.action.id.hex, { image: pic });
  }
  render() {
    return (
      <div>
        <Webcam
          audio={false}
          height={360}
          ref={this.camera}
          screenshotFormat='image/jpeg'
          width={640}
          videoConstraints={videoConstraints}
        />
        <div
          type='button'
          className='takePictureButton'
          onClick={this.screenshot.bind(this)}>
          Take a picture!
        </div>
      </div>
    );
  }
}
