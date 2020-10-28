import React from "react";
import { Button } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";

// Import Components
import SpecifyWell from "../components/actions/SpecifyWell";
import LinearArray from "../components/actions/LinearArray";
import Alert from "../components/actions/Alert";
import Link from "../components/ui/Link";
import Sonicate from "../components/actions/Sonicate";

import "./Main.css"; // Top-level styles
import WorkflowContext from "../utils/WorkflowContext";

export default class Main extends React.Component {
  static contextType = WorkflowContext;
  constructor(props) {
    super(props);

    this.addWell = this.addWell.bind(this);
    this.addLinArray = this.addLinArray.bind(this);
    this.addAlert = this.addAlert.bind(this);
    this.addSonicate = this.addSonicate.bind(this);
    this.run = this.run.bind(this);
  }

  sendOutportData(data) {
    // DONT LOOK AT THIS CODE I'M EMBARASSED
    // This is a shitty slow way of doing this but it doesn't matter at the moment I'll fix it later
    console.log(data);
    const { workflow, setWorkflow } = this.context;
    for (const link of workflow.workflowLinks) {
      console.log(link.props.outportID, data.outportID);
      if (link.props.outportID === data.outportID) {
        for (const action of workflow.workflowActions) {
          if (link.props.inportActionID === action.props.actionID) {
            console.log("found action");
            console.log(action);
            Object.entries(action.props.inports).forEach(([key, value]) => {
              // console.log(action.props.inports)
              if (value.inportID === link.props.inportID) {
                var propsToPass = { ...action.props.inports };
                propsToPass[key].value = data;
                console.log("SDFSDFSDF");
                console.log(propsToPass);
                var newEl = React.cloneElement(action, propsToPass);
                setWorkflow(
                  "workflowActions",
                  workflow.workflowActions.splice(
                    workflow.workflowActions.indexOf(action),
                    1
                  )
                );
                setWorkflow(
                  "workflowActions",
                  workflow.workflowActions.concat(newEl)
                );
                return;
              }
            });
          }
        }
      }
    }
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
          actionID={uuidv4()}
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
          createLink={this.createLink.bind(this)} // callback for getting data from child
          key={uuidv4()} // A unique ID for each action
          actionID={uuidv4()}
        />
      )
    );
  }

  addSonicate() {
    // Adds a start action to the workspace
    const { workflow, setWorkflow } = this.context; // How to access the context and update method

    // Adding the new action to the list of workflow actions
    setWorkflow(
      "workflowActions",
      workflow.workflowActions.concat(
        <Sonicate
          sendOutportData={this.sendOutportData.bind(this)} // callback for getting data from child
          createLink={this.createLink.bind(this)} // callback for getting data from child
          key={uuidv4()} // A unique ID for each action
          actionID={uuidv4()}
        />
      )
    );
  }

  addAlert() {
    // Adds a alert action to the workspace
    const { workflow, setWorkflow } = this.context; // How to access the context and update method

    // Adding the new action to the list of workflow actions
    setWorkflow(
      "workflowActions",
      workflow.workflowActions.concat(
        <Alert
          sendOutportData={this.sendOutportData.bind(this)} // callback for getting data from child
          createLink={this.createLink.bind(this)} // callback for getting data from child
          key={uuidv4()} // A unique ID for each action
          actionID={uuidv4()}
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
        {this.renderLinks()}
        <div className="buttonContainer">
          <Button className="ui button" size="mini" onClick={this.addWell}>
            Well
          </Button>
          <Button className="ui button" size="mini" onClick={this.addLinArray}>
            Linear array
          </Button>
          <Button className="ui button" size="mini" onClick={this.addAlert}>
            Alert
          </Button>
          <Button className="ui button" size="mini" onClick={this.addSonicate}>
            Sonicate
          </Button>
        </div>
        {this.renderActions()}
      </div>
    );
  }
}
