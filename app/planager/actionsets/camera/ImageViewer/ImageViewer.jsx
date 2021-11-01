import React from "react";

import "./ImageViewer.css";

export default class ImageViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
    };
  }
  componentDidUpdate(prevProps) {}

  render() {
    return (
      <div className='resizable'>
        <img
          id='imageView'
          src={
            this.props.action.inports.imIn.value
              ? this.props.action.inports.imIn.value.pic
              : null
          }
        />
      </div>
    );
  }
}
