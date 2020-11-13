import React from "react";
import GenericAction from "./GenericAction";

export default class Template extends React.Component {
  // Specify default inputs here
  static defaultProps = {
    inportData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      inports: {},
      outports: {},
    };
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        inportData={this.props.inportData}
        outports={this.state.outports}
        actionID={this.props.id}
      >
        <div className="actionTitle">Template Action</div>
        <div className="actionContent">Content goes here!</div>
      </GenericAction>
    );
  }
}
