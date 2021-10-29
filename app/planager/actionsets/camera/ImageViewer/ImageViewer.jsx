import React from "react";

export default class ImageViewer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <img
          width='200px'
          style={{ marginBottom: "-4px" }}
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
