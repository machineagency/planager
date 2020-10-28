import React from "react";
import Draggable from "react-draggable";
import { Input, Button, Icon } from "semantic-ui-react";
import WorkflowContext from "../../utils/WorkflowContext";
import "./css/Sonicate.css";

import Inport from "../ui/Inport";
import Outport from "../ui/Outport";
import { v4 as uuidv4 } from "uuid";

export default class Sonicate extends React.Component {
  static contextType = WorkflowContext; // How we access the global context
  static defaultProps = {
    inports: {
      wellList: {
        name: "wellList",
        value: null,
        type: "list of wells",
        hover: "input",
        inportID: uuidv4(),
      },
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      outports: {
        sonicationJson: {
          name: "sonicationJson",
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
    const wellList = this.props.inports.wellList.value;
    // alert(JSON.stringify(val.value));
    console.log(wellList.value.value)

    for (const well of wellList.value.value) {
        
    }

    // var updatedOutports = { ...this.state.outports };
    // updatedOutports.output.value = val;

    // this.setState({ outports: updatedOutports });
    // this.props.sendOutportData(this.state.outports.output);
  }

  render() {
    return (
      <Draggable cancel=".portsContainer, .actionInput">
        <div className="action row">
          <div className="column portsContainer">{this.renderInports()}</div>
          <div className="box column">
            <div className="actionTitle">Sonicate</div>
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