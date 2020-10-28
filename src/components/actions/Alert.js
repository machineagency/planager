import React from "react";
import Draggable from "react-draggable";
import { Input, Button, Icon } from "semantic-ui-react";
import WorkflowContext from "../../utils/WorkflowContext";
import "./css/Alert.css";

import Inport from "../ui/Inport";
import Outport from "../ui/Outport";
import { v4 as uuidv4 } from "uuid";

export default class LinearArray extends React.Component {
  static contextType = WorkflowContext; // How we access the global context
  static defaultProps = {
    inports: {
      input: {
        name: "input",
        value: null,
        type: "any",
        hover: "input",
        inportID: uuidv4(),
      },
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      outports: {
        output: {
          name: "output",
          value: null,
          type: "any",
          hover: "output",
          outportID: uuidv4(),
        },
      },

      length: null,
    };

    this.run = this.run.bind(this);
  }

  renderInports() {
    let inports = [];

    Object.entries(this.props.inports).forEach(([key, value]) => {
      inports = inports.concat(
        <Inport
          key={key}
          name={key}
          actionID={this.props.actionID}
          inportID={value.inportID}
        />
      );
    });

    return inports;
  }

  renderOutports() {
    let outports = [];

    Object.entries(this.state.outports).forEach(([key, value]) => {
      outports = outports.concat(
        <Outport
          key={key}
          name={key}
          data={value.value}
          sendOutportData={this.props.sendOutportData}
          createLink={this.props.createLink}
          outportID={value.outportID}
          actionID={this.props.actionID}
        />
      );
    });

    return outports;
  }

  run() {
    const val = this.props.inports.input.value;
    alert(JSON.stringify(val.value));
    console.log(val)

    var updatedOutports = { ...this.state.outports };
    updatedOutports.output.value = val;

    this.setState({ outports: updatedOutports });
    this.props.sendOutportData(this.state.outports.output);
  }

  render() {
    return (
      <Draggable cancel=".portsContainer, .actionInput">
        <div className="action row">
          <div className="column portsContainer">{this.renderInports()}</div>
          <div className="box column">
            <div className="actionTitle">Alert</div>
            <div className="actionContent">
              <Button
                icon
                className="ui teal primary button"
                size="mini"
                onClick={this.run}
              >
                <Icon name="play" />
              </Button>
            </div>
          </div>
          <div className="column portsContainer">{this.renderOutports()}</div>
        </div>
      </Draggable>
    );
  }
}
