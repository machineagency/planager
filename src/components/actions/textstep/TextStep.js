import React from "react";
import GenericAction from "../GenericAction";

import "./textstep.css"

export default class TextStep extends React.Component {
  // Specify default inputs here
  static defaultProps = {
    inportData: {currentStep: false},
  };

  constructor(props) {
    super(props);
    this.state = {
      inports: { prevSteps: {}, prevStepFinished: {} },
      outports: { steps: {}, stepFinished: {} },
    };
  }

  updateInstruction() {}

  updateNote() {}

  onContinue() {}

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        inportData={this.props.inportData}
        outports={this.state.outports}
        actionID={this.props.id}
      >
        <div className="actionTitle">Text Step</div>
        <div className="actionContent">
          <textarea
            rows="4"
            cols="30"
            placeholder="Enter step instructions here"
          ></textarea>
          <br />
          <textarea
            rows="4"
            cols="30"
            placeholder="Notes in this box are recorded in the protocol."
          ></textarea>
          <br />
          <button className="continuebutton">Continue</button>
        </div>
      </GenericAction>
    );
  }
}