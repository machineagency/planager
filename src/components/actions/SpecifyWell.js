import React from "react";
import Draggable from "react-draggable";
import { Icon } from "semantic-ui-react";
import WorkflowContext from "../../utils/WorkflowContext";
import "./css/SpecifyWell.css"


export default class SpecifyWell extends React.Component {
  static contextType = WorkflowContext; // How we access the global context

  constructor(props) {
    super(props);
    this.state = {
      inports: [
          {
              name: "depth",
              value: null,
              type: "float",
              units: "mm",
              hover: "well depth",
          },
          {
            name: "diameter",
            value: null,
            type: "float",
            units: "mm",
            hover: "well diameter"
          },
          {
            name: "max_volume",
            value: null,
            type: "float",
            units: "ml",
            hover: "maximum well volume"
          },
      ],
      outports: [
          {
            name: "well",
            value: null,
            type: "well",
            units: null,
            hover: "a well object"
          }
      ]
    };
  }

  run() {
    const { workflow, setWorkflow } = this.context;
    console.log("in the run method");
    this.props.parentCallback("this is a message from a child");
  }

  render() {
    return (
      <Draggable cancel=".inport, .outport, .helpicon">
        <div className="action">
          <button className="inport"></button>
          <div className="box">
            <b>Describe Well</b>
            <Icon name="help" className="helpicon"/><br />
            Volume: <br />
            Depth: <br />
            Radius <br />
          </div>
          <button className="outport"></button>
        </div>
      </Draggable>
    );
  }
}
