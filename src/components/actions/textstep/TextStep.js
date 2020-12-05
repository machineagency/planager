import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";

import "./textstep.css";

export default class TextStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [new Inport("Previous Steps", "any", false, "Previous Steps")],
      outports: [
        new Outport("Step Complete", "Boolean", false, "Step Completed"),
      ],
      editing: false,
      instructionText: "Add some instructions!",
      buttonText: "Edit",
      notes: "",
      current: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.payload) return null;

    prevState.inports[0].data = nextProps.payload.data.data;
    prevState.current = nextProps.payload.data.data;

    return prevState;
  }

  continue() {
    let outports = [...this.state.outports];
    outports[0].data = true;
    this.setState({ outports: outports });
    this.setState({ current: false });
  }

  toggleEdit() {
    this.setState({ editing: !this.state.editing });
  }

  instructionChanged(event) {
    this.setState({ instructionText: event.target.value });
    // TODO: Turn this into a dynamic form where the workflow creator can
    // specify lots of different fields
  }

  notesChanged(event) {
    this.setState({ notes: event.target.value });
  }

  toggleCurrent() {
    this.setState({ current: !this.state.current });
  }

  renderTextarea() {
    return (
      <div>
        <textarea
          rows="4"
          cols="20"
          value={this.state.instructionText}
          onChange={this.instructionChanged.bind(this)}
        />
      </div>
    );
  }

  render() {
    let content;
    if (this.state.editing) {
      content = this.renderTextarea.bind(this)();
    } else {
      content = this.state.instructionText;
    }

    return (
      <GenericAction
        inports={this.state.inports}
        outports={this.state.outports}
        actionID={this.props.id}
      >
        <div
          className={
            this.state.current ? "actionTitle blueTitle" : "actionTitle"
          }
        >
          Text Step
        </div>
        <div className="actionContent">
          <button
            className="planagerButton"
            onClick={this.toggleCurrent.bind(this)}
          >
            Toggle Current
          </button>
          <button
            className="planagerButton"
            onClick={this.toggleEdit.bind(this)}
          >
            {this.state.buttonText}
          </button>
          <br />
          <br />
          <div>{content}</div>
          <br />
          <textarea
            rows="4"
            cols="20"
            value={this.state.notes}
            onChange={this.notesChanged.bind(this)}
          />
          <br />
          <button className="planagerButton" onClick={this.continue.bind(this)}>
            Save and Continue
          </button>
        </div>
      </GenericAction>
    );
  }
}
