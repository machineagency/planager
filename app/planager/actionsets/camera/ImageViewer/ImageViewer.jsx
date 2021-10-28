import React from "react";

export default class ImageViewer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <img src={this.props.action.inports.imIn.value} />
      </div>
    );
  }
}
