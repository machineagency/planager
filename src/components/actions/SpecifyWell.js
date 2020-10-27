import React from "react";
import Draggable from "react-draggable";
import { Input } from "semantic-ui-react";
import WorkflowContext from "../../utils/WorkflowContext";
import "./css/SpecifyWell.css";
import Inport from "../ui/Inport";
import Outport from "../ui/Outport";

export default class SpecifyWell extends React.Component {
  static contextType = WorkflowContext; // How we access the global context

  constructor(props) {
    super(props);
    this.state = {
      inports: {
        depth: {
          name: "depth",
          value: null,
          type: "float",
          units: "mm",
          hover: "well depth",
          required: false,
        },
        diameter: {
          name: "diameter",
          value: null,
          type: "float",
          units: "mm",
          hover: "well diameter",
          required: false,
        },
        max_volume: {
          name: "max_volume",
          value: null,
          type: "float",
          units: "ml",
          hover: "maximum well volume",
          required: false,
        },
      },
      outports: {
        well: {
          name: "well",
          value: null,
          type: "well",
          units: null,
          hover: "a well object",
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

  componentDidMount() {}

  renderInports() {
    let inports = [];

    Object.entries(this.state.inports).forEach(([key, value]) => {
      inports = inports.concat(<Inport key={key} name={key} />);
    });

    return inports;
  }

  renderOutports() {
    let outports = [];

    Object.entries(this.state.outports).forEach(([key, value]) => {
      outports = outports.concat(<Outport key={key} name={key} />);
    });

    return outports;
  }

  run() {
    const well = {
      max_volume: this.state.volume,
      diameter: this.state.diameter,
      depth: this.state.depth,
    };
    this.props.parentCallback(well);
  }

  render() {
    return (
      <Draggable cancel=".portsContainer, .actionInput">
        <div className="action row">
          <div className="column portsContainer">
            {this.renderInports()}
          </div>
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
            </div>
          </div>
          <div className="column portsContainer">
            {this.renderOutports()}
          </div>
        </div>
      </Draggable>
    );
  }
}
