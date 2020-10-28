import React from "react";
import ReactTooltip from "react-tooltip";
import WorkflowContext from "../../utils/WorkflowContext";
import Link from "./Link";
import ReactDOM from "react-dom";
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
  }

  beginLink(event) {
    const { setWorkflow } = this.context;

    // Record starting point for the link
    const node = ReactDOM.findDOMNode(this);
    const x = node.getBoundingClientRect().x + 7;
    const y = node.getBoundingClientRect().y + 10;

    this.setState({ xcoord: x, ycoord: y });
    this.props.createLink(x, y, this.props.actionID, this.props.portID);
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
