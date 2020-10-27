import React from "react";
import { Button, Icon } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";

// Import Components
import SpecifyWell from "../components/actions/SpecifyWell";

import "./Main.css"; // Top-level styles
import WorkflowContext from "../utils/WorkflowContext";

export default class Main extends React.Component {
  static contextType = WorkflowContext;
  constructor(props) {
    super(props);

    this.addWell = this.addWell.bind(this);
    this.run = this.run.bind(this);
  }

  callbackParent(dataFromChild) {
    this.setState({ message: dataFromChild });
  }

  addWell() {
    // Adds a start action to the workspace
    const { workflow, setWorkflow } = this.context; // How to access the context and update method

    // Adding the new action to the list of workflow actions
    setWorkflow({
      workflowActions: workflow.workflowActions.concat(
        <SpecifyWell
          parentCallback={this.callbackParent.bind(this)} // callback for getting data from child
          key={uuidv4()} // A unique ID for each action
        />
      ),
    });
  }

  run(event) {
    const { workflow, setWorkflow } = this.context;
    setWorkflow({ actionQueue: "f" });
  }

  renderActions() {
    const { workflow } = this.context;
    return workflow.workflowActions;
  }

  render() {
    return (
      <div>
        <div className="buttonContainer">
          <Button
            icon
            className="ui teal primary button"
            size="mini"
            onClick={this.run}
          >
            <Icon name="play" />
          </Button>
          <Button className="ui button" size="mini" onClick={this.addWell}>
            Start
          </Button>
          <Button className="ui button" size="mini" onClick={this.addWell}>
            Well
          </Button>
          <Button className="ui button" size="mini" onClick={this.addWell}>
            2d array
          </Button>
          <Button className="ui button" size="mini" onClick={this.addWell}>
            Sonicate
          </Button>
          <Button className="ui button" size="mini" onClick={this.addWell}>
            Save to file
          </Button>
        </div>

        {this.renderActions()}
      </div>
    );
  }
}
