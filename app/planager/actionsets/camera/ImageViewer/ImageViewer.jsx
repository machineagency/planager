import React from "react";

export default class ImageViewer extends React.Component {
  constructor(props) {
    super(props);
  }
  //   componentDidUpdate(prevProps, prevState, snapshot) {
  //     if (
  //       this.props.action.inports.imIn.value !==
  //       prevProps.action.inports.imIn.value
  //     ) {
  //       this.props.sendToOutport(this.props.action.id, {
  //         imOut: this.props.action.inports.imIn.value,
  //       });
  //     }
  //   }
  render() {
    return (
      <div>
        <img src={this.props.action.inports.imIn.value} />
      </div>
    );
  }
}
