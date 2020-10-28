import React from "react";
import { Button } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";

// Import Components
import SpecifyWell from "../components/actions/SpecifyWell";
import LinearArray from "../components/actions/LinearArray";
import Link from "../components/ui/Link";
import ReactDOM from "react-dom";

import "./Main.css"; // Top-level styles
import WorkflowContext from "../utils/WorkflowContext";

export default class Main extends React.Component {
  static contextType = WorkflowContext;
  constructor(props) {
    super(props);

    this.addWell = this.addWell.bind(this);
    this.addLinArray = this.addLinArray.bind(this);
    this.run = this.run.bind(this);
  }

  sendOutportData(data) {
    console.log("Sdf");
    console.log(data);
    console.log("DATA RECEIVED");
  }

  createLink(outportX, outportY, outportActionID, outportID) {
    // Creates a link element and adds it to the context
    const { workflow, setWorkflow } = this.context;
    var nextClickCallback = (e) => {

      if (
        e.target.nodeName === "BUTTON" &&
        e.target.classList.contains("inport")
      ) {
        const inportActionID = e.target.dataset.actionid;
        const inportID = e.target.dataset.inportid;

        setWorkflow(
          "workflowLinks",
          workflow.workflowLinks.concat(
            <Link
              startx={outportX}
              starty={outportY}
              endx={e.clientX}
              endy={e.clientY}
              outportActionID={outportActionID}
              inportActionID={inportActionID}
              outportID={outportID}
              inportID={inportID}
              key={uuidv4()}
            />
          )
        );
      }
      document.removeEventListener("click", nextClickCallback);
    };

    document.addEventListener("click", nextClickCallback);
  }

  addWell() {
    // Adds a start action to the workspace
    const { workflow, setWorkflow } = this.context; // How to access the context and update method

    setWorkflow(
      "workflowActions",
      workflow.workflowActions.concat(
        <SpecifyWell
          sendOutportData={this.sendOutportData.bind(this)}
          createLink={this.createLink.bind(this)} // callback for getting data from child
          key={uuidv4()} // A unique ID for each action
        />
      )
    );
  }

  addLinArray() {
    // Adds a start action to the workspace
    const { workflow, setWorkflow } = this.context; // How to access the context and update method

    // Adding the new action to the list of workflow actions
    setWorkflow(
      "workflowActions",
      workflow.workflowActions.concat(
        <LinearArray
          sendOutportData={this.sendOutportData.bind(this)} // callback for getting data from child
          key={uuidv4()} // A unique ID for each action
        />
      )
    );
  }

  run(event) {
    // const { workflow, setWorkflow } = this.context;
    // setWorkflow({ actionQueue: "f" });
  }

  renderActions() {
    const { workflow } = this.context;
    return workflow.workflowActions;
  }

  renderLinks() {
    const { workflow } = this.context;
    return workflow.workflowLinks;
  }

  render() {
    return (
      <div>
        <div className="buttonContainer">
          {/* <Button
            icon
            className="ui teal primary button"
            size="mini"
            onClick={this.run}
          >
            <Icon name="play" />
          </Button> */}
          <Button className="ui button" size="mini" onClick={this.addWell}>
            Well
          </Button>
          <Button className="ui button" size="mini" onClick={this.addLinArray}>
            Linear array
          </Button>
        </div>

        {this.renderLinks()}

        {this.renderActions()}
      </div>
    );
  }
}
