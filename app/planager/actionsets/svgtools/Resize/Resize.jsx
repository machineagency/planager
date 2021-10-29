import React from "react";

import "./Resize.css";

export default class Resize extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resize: 100,
    };
  }
  resizeImage(percent) {
    console.log(resizing);
    img = this.props.action.inports.imageIn.value;
  }
  resize = (e) => {
    this.setState({
      resize: e.target.value,
    }).then(this.resizeImage(this.state.resize));
  };
  render() {
    return (
      <div>
        <img src={this.props.action.inports.imageIn.value} />
        <div>Resize to</div>
        <div class='slidecontainer'>
          <input
            type='range'
            min='1'
            max='100'
            value={this.state.resize}
            id='resize'
            onChange={this.resize.bind(this)}
          />
        </div>
      </div>
    );
  }
}
