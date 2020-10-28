import React from "react";
import ReactTooltip from "react-tooltip";
import WorkflowContext from "../../utils/WorkflowContext";
import ReactDOM from "react-dom";
import "./css/Outport.css";

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
    // Record starting point for the link
    const node = ReactDOM.findDOMNode(this);
    const x = node.getBoundingClientRect().x + 7;
    const y = node.getBoundingClientRect().y + 10;

    this.setState({ xcoord: x, ycoord: y });

    // Send it back up to Main via this callback
    this.props.createLink(x, y, this.props.actionID, this.props.outportID);
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
