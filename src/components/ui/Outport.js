import React from "react";
import ReactTooltip from "react-tooltip";
import "./css/Outport.css";

export default class Outport extends React.Component {
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
        <button
          className="outport"
          data-tip={this.props.name}
          onClick={this.props.outportCallback}
        />
      </>
    );
  }
}
