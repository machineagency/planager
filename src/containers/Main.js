import React from "react";
import { Button } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";

// Import Components
// import SpecifyWell from "../components/actions/SpecifyWell";
// import LinearArray from "../components/actions/LinearArray";
import Alert from "../components/actions/Alert";
import Constant from "../components/actions/Constant"
// import Link from "../components/ui/Link";
// import Sonicate from "../components/actions/Sonicate";

import "./Main.css"; // Top-level styles
import WorkflowContext from "../utils/WorkflowContext";

export default class Main extends React.Component {
  static contextType = WorkflowContext;
  constructor(props) {
    super(props);

    this.state = {
      actions: {},
      links: {},
    };

    // this.addWell = this.addWell.bind(this);
    // this.addLinArray = this.addLinArray.bind(this);
    this.addAlert = this.addAlert.bind(this);
    this.addConstant = this.addConstant.bind(this);
    // this.addSonicate = this.addSonicate.bind(this);
    // this.run = this.run.bind(this);
  }

  sendOutportData(data) {
    // DONT LOOK AT THIS CODE I'M EMBARASSED
    // This is a shitty slow way of doing this but it doesn't matter at the moment I'll fix it later
    const { workflow, setWorkflow } = this.context;
    for (const link of workflow.workflowLinks) {
      if (link.props.outportID === data.outportID) {
        for (const action of workflow.workflowActions) {
          if (link.props.inportActionID === action.props.actionID) {
            Object.entries(action.props.inports).forEach(([key, value]) => {
              // console.log(action.props.inports)
              if (value.inportID === link.props.inportID) {
                var propsToPass = { ...action.props.inports };
                propsToPass[key].value = data;
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

  // createLink(outportX, outportY, outportActionID, outportID) {
  //   // Creates a link element and adds it to the context
  //   const { workflow, setWorkflow } = this.context;
  //   var nextClickCallback = (e) => {
  //     if (
  //       e.target.nodeName === "BUTTON" &&
  //       e.target.classList.contains("inport")
  //     ) {
  //       const inportActionID = e.target.dataset.actionid;
  //       const inportID = e.target.dataset.inportid;

  //       setWorkflow(
  //         "workflowLinks",
  //         workflow.workflowLinks.concat(
  //           <Link
  //             startx={outportX}
  //             starty={outportY}
  //             endx={e.clientX}
  //             endy={e.clientY}
  //             outportActionID={outportActionID}
  //             inportActionID={inportActionID}
  //             outportID={outportID}
  //             inportID={inportID}
  //             key={uuidv4()}
  //           />
  //         )
  //       );
  //     }
  //     document.removeEventListener("click", nextClickCallback);
  //   };
  //   document.addEventListener("click", nextClickCallback);
  // }

  // addWell() {
  //   // Adds a start action to the workspace
  //   const { workflow, setWorkflow } = this.context; // How to access the context and update method

  //   setWorkflow(
  //     "workflowActions",
  //     workflow.workflowActions.concat(
  //       <SpecifyWell
  //         sendOutportData={this.sendOutportData.bind(this)}
  //         createLink={this.createLink.bind(this)} // callback for getting data from child
  //         key={uuidv4()} // A unique ID for each action
  //         actionID={uuidv4()}
  //       />
  //     )
  //   );
  // }

  // addLinArray() {
  //   // Adds a start action to the workspace
  //   const { workflow, setWorkflow } = this.context; // How to access the context and update method

  //   // Adding the new action to the list of workflow actions
  //   setWorkflow(
  //     "workflowActions",
  //     workflow.workflowActions.concat(
  //       <LinearArray
  //         sendOutportData={this.sendOutportData.bind(this)} // callback for getting data from child
  //         createLink={this.createLink.bind(this)} // callback for getting data from child
  //         key={uuidv4()} // A unique ID for each action
  //         actionID={uuidv4()}
  //       />
  //     )
  //   );
  // }

  // addSonicate() {
  //   // Adds a start action to the workspace
  //   const { workflow, setWorkflow } = this.context; // How to access the context and update method

  //   // Adding the new action to the list of workflow actions
  //   setWorkflow(
  //     "workflowActions",
  //     workflow.workflowActions.concat(
  //       <Sonicate
  //         sendOutportData={this.sendOutportData.bind(this)} // callback for getting data from child
  //         createLink={this.createLink.bind(this)} // callback for getting data from child
  //         key={uuidv4()} // A unique ID for each action
  //         actionID={uuidv4()}
  //       />
  //     )
  //   );
  // }

  addAlert() {
    // Adds a alert action to the workspace

    // Adding the new action to the list of workflow actions
    const uniqueID = uuidv4()

    const newAction = { [uniqueID]: <Alert key={uniqueID} id={uniqueID} /> };
    this.setState({ actions: Object.assign(this.state.actions, newAction) });
  }

  addConstant() {
    // Adds a alert action to the workspace

    // Adding the new action to the list of workflow actions
    const uniqueID = uuidv4()

    const newAction = { [uniqueID]: <Constant key={uniqueID} id={uniqueID} /> };
    this.setState({ actions: Object.assign(this.state.actions, newAction) });
  }

  // run(event) {
  //   // const { workflow, setWorkflow } = this.context;
  //   // setWorkflow({ actionQueue: "f" });
  // }

  renderActions() {
    let actionList = []
    for (let [key, value] of Object.entries(this.state.actions)) {
      actionList = actionList.concat(value)
    }

    return actionList;
  }

  renderLinks() {
    const { workflow } = this.context;
    return workflow.workflowLinks;
  }

  render() {
    return (
      <>
        {" "}
        {/* This is react fragment syntax, which prevents extra divs from being added to the DOM}*/}
        {this.renderLinks()}
        <div className="buttonContainer">
          {/* <Button className="ui button" size="mini" onClick={this.addWell}>
            Well
          </Button>
          <Button className="ui button" size="mini" onClick={this.addLinArray}>
            Linear array
          </Button>
          <Button className="ui button" size="mini" onClick={this.addSonicate}>
            Sonicate
          </Button> */}
          <Button className="ui button" size="mini" onClick={this.addAlert}>
            Alert
          </Button>
          <Button className="ui button" size="mini" onClick={this.addConstant}>
            Constant
          </Button>
        </div>
        {this.renderActions()}
      </>
    );
  }
}
