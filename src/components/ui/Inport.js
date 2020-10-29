import React from "react";
import ReactTooltip from "react-tooltip";
import "./css/Inport.css";

export default class Inport extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log("In constructor");
  }

  render() {
    return (
      <>
        <ReactTooltip />
        <div
          data-tip={this.props.name}
          className="inport"
          onClick={this.props.inportCallback}
        />
      </>
    );
  }
}
