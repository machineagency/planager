import React from "react";
import Draggable from "react-draggable";
import WorkflowContext from "../../utils/WorkflowContext";

export default class Start extends React.Component {
  static contextType = WorkflowContext; // How we access the global context

  constructor(props) {
    super(props);
    this.state = {
      next: null,
    };
  }

  run() {
    const { workflow, setWorkflow } = this.context
    console.log("in the run method")
    this.props.parentCallback("this is a message from a child");
  }

  render() {
    return (
      <Draggable cancel=".inport, .outport">
        <div className="action">
          <button className="inport"></button>
          <div className="box">
            UI Content goes here
          </div>
          <button className="outport"></button>
        </div>
      </Draggable>
    );
  }
}
