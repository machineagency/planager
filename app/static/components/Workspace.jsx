import React from "react";

import Action from "./Action";
import Link from "./Link";

import "./styles/workspace.css";

import PlanagerWebcam from "../../planager/actionsets/camera/PlanagerWebcam/PlanagerWebcam";
import ImageTrace from "../../planager/actionsets/svgtools/ImageTrace/ImageTrace";
import ImageViewer from "../../planager/actionsets/camera/ImageViewer/ImageViewer";
import DrawSVG from "../../planager/actionsets/axidraw/DrawSVG/DrawSVG";
import Options from "../../planager/actionsets/axidraw/Options/Options";
import Resize from "../../planager/actionsets/svgtools/Resize/Resize";
import KnitspeakEditor from "../../planager/actionsets/knitting/KnitspeakEditor/KnitspeakEditor";
import KnitspeakToKnitgraph from "../../planager/actionsets/knitting/KnitspeakToKnitgraph/KnitspeakToKnitgraph";
import KnitgraphVisualizer from "../../planager/actionsets/knitting/KnitgraphVisualizer/KnitgraphVisualizer";
import Editor from "../../planager/actionsets/io/Editor/Editor";

const actionUImap = {
  PlanagerWebcam: PlanagerWebcam,
  ImageTrace: ImageTrace,
  ImageViewer: ImageViewer,
  DrawSVG: DrawSVG,
  Options: Options,
  Resize: Resize,
  KnitspeakEditor: KnitspeakEditor,
  KnitspeakToKnitgraph: KnitspeakToKnitgraph,
  KnitgraphVisualizer: KnitgraphVisualizer,
  Editor: Editor,
};

export default class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plan: {},
      dropdown: {},
      actionDict: {},
      examples: {},
      links: {},
      actions: {},
      mouseX: 0,
      mouseY: 0,
    };
    // Get all of the actions that are available for the Planager
    fetch("/getActions", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          actionDict: result.actions,
          dropdown: result.dropdown,
        });
      });
    fetch("/clearPlan", { method: "get" });
  }

  // uploadPlan(event) {
  //   var reader = new FileReader();

  // // This callback is run when the file loads
  // reader.onload = (event) => {
  //   const plan = JSON.parse(event.target.result);
  //   fetch("/uploadPlan", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(plan),
  //   })
  //     .then((res) => res.json())
  //     // Todo: check for plan correctness in the backend and return the appropriate code
  //     .then((result) => {
  //       console.debug(result);
  //       this.setState({ plan: plan }, this.updatePlan);
  //     });
  // };
  // reader.readAsText(event.target.files[0]);
  // }
  getConnections(actionID) {
    // Builds an object containing all of the connections to and from an action.
    const action = this.state.actions[actionID];
    let connections = { inports: {}, outports: {} };

    // Get connections to inports
    for (const [inportName, inport] of Object.entries(action.inports)) {
      for (const [actionID, portID] of Object.entries(inport.connections)) {
        connections.inports[inportName] = [actionID, portID];
      }
    }
    // Get connections from outports
    for (const [outportName, outport] of Object.entries(action.outports)) {
      for (const [actionID, portID] of Object.entries(outport.connections)) {
        connections.outports[outportName] = [actionID, portID];
      }
    }
    return connections;
  }
  makeLinkID(startActionID, startPortID, endActionID, endPortID) {
    // Builds a unique ID for a link
    // TODO: add assertion
    return `${startActionID}_${startPortID}_${endActionID}_${endPortID}`;
  }
  triggerRender() {
    // Helper function to trigger a render, as react doesn't detect changes to nested objects in the state
    this.setState(this.state);
  }
  mousemoveCallback(e) {
    this.setState({ mouseX: e.clientX, mouseY: e.clientY });
  }
  beginConnection(e, startActionID, startPortID) {
    // Create a temporary link object
    let link = {
      startActionID: startActionID,
      startPortID: startPortID,
      startPortRef: this.state.actions[startActionID].outportRefs[startPortID],
    };

    // Add the temporary link to the link object in the state
    let oldLinks = { ...this.state.links };
    oldLinks["linkInProgress"] = link;
    this.setState({ links: oldLinks });

    // Add an event listener so the link tracks the mouse movement
    document.addEventListener("mousemove", this.mousemoveCallback.bind(this));
  }
  endConnection(e, endActionID, endPortID) {
    const linkInProgress = this.state.links.linkInProgress;
    if (!linkInProgress) return;

    // Tell the backend that this link has been made
    fetch("/addLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startActionID: linkInProgress.startActionID,
        startPortID: linkInProgress.startPortID,
        endActionID: endActionID,
        endPortID: endPortID,
      }),
    })
      .then((res) => res.json())
      .then((link) => {
        // Call the create link method to add the new link to the state
        this.createLink(link);
      });

    // Remove the temporary link from the state
    let oldLinks = this.state.links;
    delete oldLinks.linkInProgress;
    this.setState({ links: oldLinks });
    // Remove the event listener
    document.removeEventListener("mousemove", this.mousemoveCallback);
  }
  renderActions() {
    let renderedActions = [];
    for (const [actionID, action] of Object.entries(this.state.actions)) {
      renderedActions.push(action.component);
    }
    return renderedActions;
  }
  renderLinks() {
    let renderedLinks = [];
    for (const [linkID, link] of Object.entries(this.state.links)) {
      let coords = {};
      const startBounds = link.startPortRef.current.getBoundingClientRect();
      coords.startx = startBounds.left + startBounds.width / 2;
      coords.starty = startBounds.top + startBounds.height / 2;

      if (linkID == "linkInProgress") {
        coords.endx = this.state.mouseX;
        coords.endy = this.state.mouseY;
      } else {
        const endBounds = link.endPortRef.current.getBoundingClientRect();
        coords.endx = endBounds.left + endBounds.width / 2;
        coords.endy = endBounds.top + endBounds.height / 2;
      }

      renderedLinks.push(
        <Link
          link={link}
          key={linkID}
          startx={coords.startx}
          starty={coords.starty}
          endx={coords.endx}
          endy={coords.endy}
        />
      );
    }
    return renderedLinks;
  }
  // getComponent(actionName) {
  //   let component = this.state.actionDict[actionName].component;
  //   if (component) return component;
  //   // Else, load the UI component
  //   // const componentPath = `../../planager/actionsets/${this.state.actionDict[actionName].actionSet}/${actionName}/${actionName}`;
  //   const componentPath =
  //     "../../planager/actionsets/axidraw/AxidrawConnect/AxidrawConnect";
  //   // component = React.lazy(() => import(componentPath));
  //   return Loadable({
  //     loader: () => import(componentPath),
  //     loading: <div>Loading...</div>,
  //   });
  // }
  sendToOutport(actionID, dataDict) {
    fetch("/sendDataToOutport", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actionID: actionID,
        dataDict: dataDict,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // TODO: res is the plan. in the backend we should only return the actions that have changed, and then update their values here on the frontend.
        console.log(res);
      });
  }
  renderActionUI(action) {
    let ui;
    try {
      ui = React.createElement(actionUImap[action.name], {
        sendToOutport: this.sendToOutport.bind(this),
        action: action,
      });
    } catch (error) {
      ui = React.createElement("span");
    }
    return ui;
  }
  createLink(link) {
    const linkID = this.makeLinkID(
      link.startActionID,
      link.startPortID,
      link.endActionID,
      link.endPortID
    );
    link["startPortRef"] =
      this.state.actions[link.startActionID].outportRefs[link.startPortID];
    link["endPortRef"] =
      this.state.actions[link.endActionID].inportRefs[link.endPortID];

    let oldLinks = { ...this.state.links };
    oldLinks[linkID] = link;
    this.setState({ links: oldLinks });
  }
  createAction(action) {
    console.log(action);
    let inportRefs = {};
    let outportRefs = {};

    for (const [inportName, inport] of Object.entries(action.inports)) {
      inportRefs[inportName] = React.createRef();
    }
    action["inportRefs"] = inportRefs;

    for (const [outportName, outport] of Object.entries(action.outports)) {
      outportRefs[outportName] = React.createRef();
    }

    action["outportRefs"] = outportRefs;

    let actionComponent = (
      <Action
        action={action}
        inports={action.inports}
        inportRefs={inportRefs}
        outports={action.outports}
        outportRefs={outportRefs}
        beginConnection={this.beginConnection.bind(this)}
        endConnection={this.endConnection.bind(this)}
        removeAction={this.removeAction.bind(this)}
        key={action.id}
        triggerRender={this.triggerRender.bind(this)}
        coords={{ x: 1000, y: 1000 }}>
        {this.renderActionUI(action)}
      </Action>
    );

    action["component"] = actionComponent;

    let oldActions = { ...this.state.actions };
    oldActions[action.id] = action;
    this.setState({ actions: oldActions });
  }
  addAction(actionSet, action) {
    fetch("/addAction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actionSet: actionSet,
        action: action,
      }),
    })
      .then((res) => res.json())
      .then((action) => {
        this.createAction(action);
      });
  }
  removeAction(actionID) {
    fetch("/removeAction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        actionID: actionID,
      }),
    })
      .then((res) => res.json())
      .then((actionID) => {
        let actions = { ...this.state.actions };
        delete actions[actionID];
        this.setState({ actions: actions });
      });
  }
  loadExample(example) {
    console.log("loading an example");
    console.log(example);
  }
  renderActionDropdown(actionSetName, actionSet) {
    let actionList = [];
    for (const action of actionSet) {
      actionList.push(
        <div key={action}>
          <div
            type='button'
            className='dropdownAction'
            onClick={this.addAction.bind(this, actionSetName, action)}>
            {action}
          </div>
        </div>
      );
    }
    return actionList;
  }
  renderActionSetDropdown() {
    // TODO: Make a react dropdown component
    let dropdown = [];
    for (const actionSet of Object.keys(this.state.dropdown)) {
      dropdown.push(
        <div key={actionSet} className='dropdownActionSet'>
          <div className='textContainer'>
            <div className='dropdownActionSetText'>{actionSet}</div>
          </div>
          <div className='actionListContainer'>
            {this.renderActionDropdown(
              actionSet,
              this.state.dropdown[actionSet]
            )}
          </div>
        </div>
      );
    }
    return dropdown;
  }
  renderExampleDropdown() {
    // TODO: Make a react dropdown component
    let exampleList = [];

    for (const value of this.state.examples) {
      exampleList.push(
        <div key={value}>
          <div
            type='button'
            className='dropdownActionSet'
            onClick={this.loadExample.bind(this, value)}>
            {value}
          </div>
        </div>
      );
    }

    return exampleList;
  }
  render() {
    return (
      <div id='container'>
        <div className='toolbar'>
          <span id='toolbarTitle' className='unselectable'>
            Planager
          </span>
          {/* <label title='Load plan' className='toolbarButton unselectable'>
            Upload
            <input type='file' onChange={this.uploadPlan.bind(this)} />
          </label> */}
          <span className='relative'>
            <span
              title='Actions'
              className='toolbarButton unselectable addAction'>
              Actions
              <div className='actionDropdownContainer'>
                {this.renderActionSetDropdown()}
              </div>
            </span>
          </span>
          <span className='relative'>
            <span
              title='Examples'
              className='toolbarButton unselectable addAction'>
              Examples
              <div className='actionDropdownContainer'>
                {this.renderExampleDropdown()}
              </div>
            </span>
          </span>
        </div>
        <div id='workflowCanvas'>
          {this.renderLinks()}
          {this.renderActions()}
        </div>
      </div>
    );
  }
}
