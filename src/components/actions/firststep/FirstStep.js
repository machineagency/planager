import React from "react";
import GenericAction from "../GenericAction";

export default class FirstStep extends React.Component {
  // Specify default inputs here
  static defaultProps = {
    inportData: {currentStep: false},
  };

  constructor(props) {
    super(props);
    this.state = {
      inports: { initialData: {}},
      outports: { stepData: {}, stepFinished: false },
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
            defaultValue="Enter step instructions here"
          ></textarea>
          <br />
          <textarea
            rows="4"
            cols="30"
            defaultValue="Notes in this box are recorded in the protocol."
          ></textarea>
          <br />
          <button>Continue</button>
        </div>
      </GenericAction>
    );
  }
}
