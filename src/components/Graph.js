import React from "react";
import Draggable from "react-draggable";

export default class Graph extends React.Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}
