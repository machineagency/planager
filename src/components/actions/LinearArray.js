import React from "react";
import Draggable from "react-draggable";
import { Input } from "semantic-ui-react";
import WorkflowContext from "../../utils/WorkflowContext";
import "./css/LinearArray.css";

import Inport from "../ui/Inport";
import Outport from "../ui/Outport";

export default class LinearArray extends React.Component {
  static contextType = WorkflowContext; // How we access the global context

  constructor(props) {
    super(props);
    this.state = {
      inports: [
        {
          name: "item",
          value: null,
          type: "any",
          hover: "item",
        },
        {
          name: "length",
          value: null,
          type: "int",
          hover: "well diameter",
        },
      ],
      outports: [
        {
          name: "array",
          value: null,
          type: "array",
          hover: "an array",
        },
      ],
      item: null,
      length: null,
    };

    this.lengthChangeHandler = this.lengthChangeHandler.bind(this);
    this.run = this.run.bind(this);
  }

  lengthChangeHandler(event) {
    this.setState({ volume: event.target.value });
  }

  renderInports() {
    let inports = [];

    Object.entries(this.state.inports).forEach(([key, value]) => {
      inports = inports.concat(<Inport key={key} />);
    });

    return inports;
  }

  renderOutports() {
    let outports = [];

    Object.entries(this.state.outports).forEach(([key, value]) => {
      outports = outports.concat(<Outport key={key} />);
    });

    return outports;
  }

  componentDidMount() {}

  run() {
    const linArray = Array(this.state.length);
    linArray.fill(this.state.item);
    this.props.parentCallback(linArray);
  }

  render() {
    return (
      <Draggable cancel=".inport, .outport, .actionInput">
        <div className="action row">
          <div id="inportsContainer" className="column">
            {this.renderInports()}
          </div>
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
              </div>
            </div>
          <div className="column">
            {this.renderOutports()}
          </div>
        </div>
      </Draggable>
    );
  }
}
