import React from "react";

import Action from "./Action";
import Link from "./Link";
import Toolbar from "./Toolbar";

import "./styles/workspace.css";

import { socket, SocketContext } from "../context/socket";
import { default as actionUImap } from "../ActionLoader";

export default class Workspace extends React.Component {
  static contextType = SocketContext;
  constructor(props) {
    super(props);
    this.state = {
      dropdown: {},
      actionDict: {},
      links: {},
      actions: {},
      mouseX: 0,
      mouseY: 0,
      newActionCoords: { x: 200, y: 200 },
    };

    // Bind these callbacks so that we can remove them from event listeners
    // If we don't bind them, we won't have references to the correct listener
    // callbacks because they will be anonymous, and the listener will keep listening
    this.removeMouseListeners = this.removeMouseListeners.bind(this);
    this.mousemoveCallback = this.mousemoveCallback.bind(this);
    this.cancelConnection = this.cancelConnection.bind(this);
  }
  componentDidMount() {
    // Once the workspace has loaded, we must tell it what methods to run on socket events
    let socket = this.context;
    socket.on("updateActionJSON", this.updateActionJSON.bind(this));
    socket.on("portsUpdated", this.portsUpdated.bind(this));
    socket.on("animateLinkDataflow", this.animateLinkDataflow.bind(this));
    // Get all of the actions that are available for the Planager
    socket.emit("getAvailableActions", (result) => {
      this.setState({
        actionDict: result.actions,
        dropdown: result.dropdown,
      });
    });
  }
  savePlan() {
    // TODO: Need to save additional info like actionset in order to rebuild
    let socket = this.context;
    socket.emit("savePlan", (plan) => {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(plan)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = "plan.json";

      link.click();
    });
  }
  buildPlanFromJSON(plan) {
    console.log(plan);
    // Add the actions to the plan
    for (const action of Object.values(plan.actions)) {
      this.createAction(action);
    }
    // Now that they're all added, we can connect them
    for (const action of Object.values(plan.actions)) {
      for (const [startPortID, outportInfo] of Object.entries(
        action.outports
      )) {
        for (const [endActionID, endPortID] of Object.entries(
          outportInfo.connections
        )) {
          this.createLink({
            startActionID: action.id,
            startPortID: startPortID,
            endActionID: endActionID,
            endPortID: endPortID,
          });
        }
      }
    }
  }
  uploadPlan(event) {
    var reader = new FileReader();

    // This callback is run when the file loads
    reader.onload = (event) => {
      const plan = JSON.parse(event.target.result);
      socket.emit("uploadPlan", plan, (result) => {
        this.buildPlanFromJSON(result);
      });
    };

    reader.readAsText(event.target.files[0]);
  }
  portsUpdated(actionJSON) {
    let actions = this.state.actions;
    const newInports = Object.keys(actionJSON.inports);
    const newOutports = Object.keys(actionJSON.outports);
    const inportsDifference = newInports.filter(
      (x) => !Object.keys(actions[actionJSON.id].inportRefs).includes(x)
    );
    const outportsDifference = newOutports.filter(
      (x) => !Object.keys(actions[actionJSON.id].outportRefs).includes(x)
    );
    console.log(inportsDifference, outportsDifference);
    for (const inportName of inportsDifference) {
      actions[actionJSON.id].inportRefs[inportName] = React.createRef();
    }
    for (const outportName of outportsDifference) {
      actions[actionJSON.id].outportRefs[outportName] = React.createRef();
    }
    actions[actionJSON.id].component = React.cloneElement(
      actions[actionJSON.id].component,
      {
        action: actionJSON,
        inportRefs: actions[actionJSON.id].inportRefs,
        outportRefs: actions[actionJSON.id].outportRefs,
      }
    );
    actions[actionJSON.id].action = actionJSON;
    this.setState({ actions: actions });
  }
  updateActionJSON(action) {
    // console.debug("Processing update from backend for action:", action);
    let actions = this.state.actions;
    if (!actions[action.id]) return;

    actions[action.id].component = React.cloneElement(
      actions[action.id].component,
      { action: action }
    );
    actions[action.id].action = action;
    this.setState({ actions: actions });
  }
  makeLinkID(startActionID, startPortID, endActionID, endPortID) {
    // Builds a unique ID for a link
    // TODO: add assertion
    return `${startActionID}_${startPortID}_${endActionID}_${endPortID}`;
  }
  breakLinkID(linkID) {
    const splitID = linkID.split("_");
    return {
      startActionID: splitID[0],
      startPortID: splitID[1],
      endActionID: splitID[2],
      endPortID: splitID[3],
    };
  }
  triggerRender() {
    // Helper function to trigger a render, as react doesn't detect changes to nested objects in the state
    this.setState(this.state);
  }
  mousemoveCallback(e) {
    this.setState({ mouseX: e.clientX, mouseY: e.clientY });
  }
  removeMouseListeners() {
    // Remove the mouse listeners we added when creating a new connection
    window.removeEventListener("mousemove", this.mousemoveCallback);
    window.removeEventListener("contextmenu", this.cancelConnection);
  }
  cancelConnection(e) {
    e.preventDefault();
    let oldLinks = this.state.links;
    delete oldLinks.linkInProgress;
    this.setState({ links: oldLinks }, this.removeMouseListeners);
  }
  beginConnection(e, startActionID, startPortID) {
    // Create a temporary link object
    let link = {
      startActionID: startActionID,
      startPortID: startPortID,
      startPortRef: this.state.actions[startActionID].outportRefs[startPortID],
    };

    // Add the temporary link to the link object in the state. Also add the current mouse position from the event, so the link in progress will render from the correct location.
    let oldLinks = { ...this.state.links };
    oldLinks["linkInProgress"] = link;
    this.setState({ links: oldLinks, mouseX: e.clientX, mouseY: e.clientY });

    // Add an event listener so the link tracks the mouse movement
    window.addEventListener("mousemove", this.mousemoveCallback);
    // Add an event listener so we can cancel the connection on right click
    window.addEventListener("contextmenu", this.cancelConnection);
  }
  endConnection(e, endActionID, endPortID) {
    const linkInProgress = this.state.links.linkInProgress;
    if (!linkInProgress) return;

    const socket = this.context;
    socket.emit(
      "addLink",
      {
        startActionID: linkInProgress.startActionID,
        startPortID: linkInProgress.startPortID,
        endActionID: endActionID,
        endPortID: endPortID,
      },
      (result) => {
        this.createLink(result.linkData);
      }
    );

    // Remove the temporary link from the state and then remove the listeners
    let oldLinks = this.state.links;
    delete oldLinks.linkInProgress;
    this.setState({ links: oldLinks }, this.removeMouseListeners);
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
      if (link.startPortRef.current == null) continue;
      const startBounds = link.startPortRef.current.getBoundingClientRect();
      coords.startx = startBounds.left + startBounds.width / 2;
      coords.starty = startBounds.top + startBounds.height / 2;

      // If this is the temporary link, we want the endpoint to be
      // at the mouse rather than the port.
      if (linkID == "linkInProgress") {
        coords.endx = this.state.mouseX;
        coords.endy = this.state.mouseY;
      } else {
        if (link.endPortRef.current == null) continue;
        const endBounds = link.endPortRef.current.getBoundingClientRect();
        coords.endx = endBounds.left + endBounds.width / 2;
        coords.endy = endBounds.top + endBounds.height / 2;
      }

      renderedLinks.push(
        <Link
          removeLink={this.removeLink.bind(this)}
          ref={link.linkRef}
          link={link}
          id={linkID}
          key={linkID}
          startX={coords.startx}
          startY={coords.starty}
          endX={coords.endx}
          endY={coords.endy}
        />
      );
    }
    return renderedLinks;
  }
  animateLinkDataflow(linkInfo) {
    let linkToAnimate = this.makeLinkID(
      linkInfo.startActionID,
      linkInfo.startPortID,
      linkInfo.endActionID,
      linkInfo.endPortID
    );
    this.state.links[linkToAnimate].linkRef.current.runAnimation();
  }
  sendToOutport(actionID, dataDict) {
    const socket = this.context;
    socket.emit(
      "sendDataToOutport",
      {
        actionID: actionID,
        dataDict: dataDict,
      },
      (result) => {
        if (result.error) {
          alert(result.error);
        }
      }
    );
  }
  runBackendMethod(actionID, methodName, args) {
    const socket = this.context;
    socket.emit(
      "runBackendMethod",
      {
        actionID: actionID,
        method: methodName,
        args: args,
      },
      (result) => {
        console.log(result);
      }
    );
  }
  renderActionUI(action) {
    let ui;
    try {
      ui = React.createElement(actionUImap[action.name], {
        sendToOutport: this.sendToOutport.bind(this),
        runBackendMethod: this.runBackendMethod.bind(this),
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
    link["linkRef"] = React.createRef();

    let oldLinks = { ...this.state.links };
    oldLinks[linkID] = link;
    this.setState({ links: oldLinks });
  }
  createAction(action) {
    const socket = this.context;
    let inportRefs = {};
    let outportRefs = {};
    let coords = this.state.newActionCoords;

    if (action.coords) {
      coords = action.coords;
    }

    for (const [inportName, inport] of Object.entries(action.inports)) {
      inportRefs[inportName] = React.createRef();
    }

    for (const [outportName, outport] of Object.entries(action.outports)) {
      outportRefs[outportName] = React.createRef();
    }

    let newAction = {
      action: action,
      inportRefs: inportRefs,
      outportRefs: outportRefs,
    };

    function onActionMoved(coords) {
      socket.emit("actionMoved", { actionID: action.id, coords: coords });
    }
    // This passes through the action's UI as a child of the generic action component
    let actionComponent = (
      <Action
        action={newAction.action}
        inportRefs={inportRefs}
        outportRefs={outportRefs}
        beginConnection={this.beginConnection.bind(this)}
        endConnection={this.endConnection.bind(this)}
        removeAction={this.removeAction.bind(this)}
        key={newAction.action.id}
        triggerRender={this.triggerRender.bind(this)}
        coords={coords}
        onActionMoved={onActionMoved}>
        {this.renderActionUI(newAction.action)}
      </Action>
    );

    newAction["component"] = actionComponent;

    let oldActions = { ...this.state.actions };
    oldActions[newAction.action.id] = newAction;
    this.setState({
      actions: oldActions,
      newActionCoords: { x: coords.x + 20, y: coords.y + 20 },
    });
  }
  addAction(actionSet, action) {
    const socket = this.context;
    socket.emit(
      "addAction",
      {
        actionSet: actionSet,
        action: action,
      },
      (returnedAction) => {
        this.createAction(returnedAction);
      }
    );
  }
  removeAction(actionID) {
    const socket = this.context;
    socket.emit("removeAction", { actionID: actionID }, (action) => {
      // Goes through the links attached to the removed action and removes them
      let links = { ...this.state.links };
      for (const [outportID, outport] of Object.entries(action.outports)) {
        // For each outport
        for (const [endActionID, inportID] of Object.entries(
          // For each connection attached to the port
          outport.connections
        )) {
          delete links[
            this.makeLinkID(action.id, outportID, endActionID, inportID)
          ];
        }
      }
      for (const [inportID, inport] of Object.entries(action.inports)) {
        // For each inport
        for (const [startActionID, outportID] of Object.entries(
          // For each connection attached to the port
          inport.connections
        )) {
          delete links[
            this.makeLinkID(startActionID, outportID, action.id, inportID)
          ];
        }
      }

      // Then removes the action
      let actions = { ...this.state.actions };
      delete actions[action.id];

      // And updates the state
      this.setState({ actions: actions, links: links });
    });
  }
  removeLink(linkID) {
    const socket = this.context;
    const linkInfo = this.breakLinkID(linkID);
    socket.emit(
      "removeLink",
      {
        startActionID: linkInfo["startActionID"],
        startPortID: linkInfo["startPortID"],
        endActionID: linkInfo["endActionID"],
        endPortID: linkInfo["endPortID"],
      },
      (result) => {
        let oldLinks = { ...this.state.links };
        delete oldLinks[linkID];
        this.setState({ links: oldLinks });
      }
    );
  }
  render() {
    return (
      <div id='container'>
        <Toolbar
          dropdownInfo={this.state.dropdown}
          addAction={this.addAction.bind(this)}
          uploadPlan={this.uploadPlan.bind(this)}
          savePlan={this.savePlan.bind(this)}
        />
        <div id='workflowCanvas'>
          {this.renderLinks()}
          {this.renderActions()}
        </div>
      </div>
    );
  }
}
