import React from "react";
import ReactTooltip from "react-tooltip";
import WorkflowContext from "../../utils/WorkflowContext";
import Link from "./Link";
import "./css/Outport.css";
import { v4 as uuidv4 } from "uuid";

export default class Outport extends React.Component {
  static contextType = WorkflowContext;
  constructor(props) {
    super(props);
    this.state = {
      linking: false,
      xcoord: null,
      ycoord: null,
    };

    this.beginLink = this.beginLink.bind(this);
    this.endLink = this.endLink.bind(this);
  }

  beginLink(event) {
    this.setState({ linking: true });
    console.log("begin link");
    console.log("mouse location:", event.clientX, event.clientY);
    this.setState({ xcoord: event.clientX });
    this.setState({ ycoord: event.clientY });
    document.addEventListener("click", this.endLink);
  }

  drawLink(endx, endy) {
    const { workflow, setWorkflow } = this.context;
    setWorkflow(
      "workflowLinks",
      workflow.workflowLinks.concat(
        <Link
          startx={this.state.xcoord}
          starty={this.state.ycoord}
          endx={endx}
          endy={endy}
          key={String(this.xcoord)+String(this.ycoord)}
        />
      )
    );
  }

  endLink(event) {
    this.setState({ linking: false });
    this.drawLink(event.clientX, event.clientY);
    document.removeEventListener("click", this.endLink);
  }

  render() {
    return (
      <div>
        <ReactTooltip />
        <button
          className="outport"
          onClick={this.beginLink}
          data-tip={this.props.name}
        />
      </div>
    );
  }
}
