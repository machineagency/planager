import React from "react";
import Draggable from "react-draggable";
import { Input, Button, Icon } from "semantic-ui-react";
import WorkflowContext from "../../utils/WorkflowContext";
import "./css/LinearArray.css";

import Inport from "../ui/Inport";
import Outport from "../ui/Outport";
import { v4 as uuidv4 } from "uuid";

export default class LinearArray extends React.Component {
  static contextType = WorkflowContext; // How we access the global context
  static defaultProps = {
    inports: {
      item: {
        name: "item",
        value: null,
        type: "any",
        hover: "item",
        inportID: uuidv4()
      },
      length: {
        name: "length",
        value: null,
        type: "int",
        hover: "well diameter",
        inportID: uuidv4()
      },
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      outports: {
        array: {
          name: "array",
          value: null,
          type: "array",
          hover: "an array",
          outportID: uuidv4(),
        },
      },

      length: null,
    };

    this.lengthChangeHandler = this.lengthChangeHandler.bind(this);
    this.run = this.run.bind(this);
  }

  lengthChangeHandler(event) {
    this.setState({ length: event.target.value });
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
    let linArray = []

    const val = this.props.inports.item.value

    for (var i=0; i<this.state.length; i++) {
      linArray = linArray.concat(val)
    }

    var updatedOutports = { ...this.state.outports}
    updatedOutports.array.value = linArray

    this.setState({outports:updatedOutports})
    this.props.sendOutportData(this.state.outports.array);
  }

  render() {
    return (
      <Draggable cancel=".portsContainer, .actionInput">
        <div className="action row">
          <div className="column portsContainer">{this.renderInports()}</div>
          <div className="box column">
            <div className="actionTitle">Linear Array</div>
            <div className="actionContent">
              <Input
                fluid
                label="Length"
                size="mini"
                placeholder="Length (int)"
                className="actionInput"
                onChange={this.lengthChangeHandler}
              />
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
