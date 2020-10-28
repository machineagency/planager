import React from "react";
import Draggable from "react-draggable";
import { Input, Button, Icon } from "semantic-ui-react";
import WorkflowContext from "../../utils/WorkflowContext";
import "./css/SpecifyWell.css";
import Inport from "../ui/Inport";
import Outport from "../ui/Outport";
import { v4 as uuidv4 } from "uuid";

export default class SpecifyWell extends React.Component {
  static contextType = WorkflowContext; // How we access the global context
  static defaultProps = {
    inports: {
      depth: {
        name: "depth",
        value: null,
        type: "float",
        units: "mm",
        hover: "well depth",
        required: false,
        // inportID: uuidv4(),
      },
      diameter: {
        name: "diameter",
        value: null,
        type: "float",
        units: "mm",
        hover: "well diameter",
        required: false,
        // inportID: uuidv4(),
      },
      max_volume: {
        name: "max_volume",
        value: null,
        type: "float",
        units: "ml",
        hover: "maximum well volume",
        required: false,
        // inportID: uuidv4(),
      },
    },
    // actionID: uuidv4()
  }

  constructor(props) {
    super(props);
    this.state = {
      outports: {
        well: {
          name: "well",
          value: null,
          type: "well",
          units: null,
          hover: "a well object",
          outportID: uuidv4(),
        },
      },
      volume: null,
      depth: null,
      diameter: null,
    };

    this.diameterChangeHandler = this.diameterChangeHandler.bind(this);
    this.depthChangeHandler = this.depthChangeHandler.bind(this);
    this.volumeChangeHandler = this.volumeChangeHandler.bind(this);
    this.run = this.run.bind(this);
  }

  volumeChangeHandler(event) {
    this.setState({ volume: event.target.value });
  }

  diameterChangeHandler(event) {
    this.setState({ diameter: event.target.value });
  }

  depthChangeHandler(event) {
    this.setState({ depth: event.target.value });
  }

  renderInports() {
    let inports = [];

    Object.entries(this.props.inports).forEach(([key, value]) => {
      inports = inports.concat(
        <Inport
          key={key}
          name={key}
          inportID={uuidv4()}
          actionID={this.props.actionID}
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
    const well = {
      max_volume: this.state.volume,
      diameter: this.state.diameter,
      depth: this.state.depth,
    };

    var updatedOutports = { ...this.state.outports };
    updatedOutports.well.value = well;

    this.setState({ outports: updatedOutports });
    this.props.sendOutportData(this.state.outports.well);
  }

  render() {
    return (
      <Draggable cancel=".portsContainer, .actionInput">
        <div className="action row">
          <div className="column portsContainer">{this.renderInports()}</div>
          <div className="box column">
            <div className="actionTitle">Describe Well</div>
            <div className="actionContent">
              <Input
                fluid
                label="Volume"
                size="mini"
                placeholder="Volume (mL)"
                className="actionInput"
                onChange={this.volumeChangeHandler}
              />
              <Input
                fluid
                label="Diameter"
                size="mini"
                placeholder="Diameter (mm)"
                className="actionInput"
                onChange={this.diameterChangeHandler}
              />
              <Input
                fluid
                label="Depth"
                size="mini"
                placeholder="Depth (mm)"
                className="actionInput"
                onChange={this.depthChangeHandler}
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
