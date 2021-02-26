/** @jsx jsx */
import React from "react";
import { v4 as uuidv4 } from "uuid";
import Link from "./Link";
import * as Actions from "../actions/ActionLoader";
import "./styles/main.css";
import GlobalContext from "../../utils/GlobalContext";
import { jsx } from "theme-ui";

// Icon imports
import { VscCloudUpload, VscSave, VscAdd } from "react-icons/vsc";
import { BsGearFill } from "react-icons/bs";
import ToggleColorMode from "./ToggleColorMode";

export default class Main extends React.Component {
  static contextType = GlobalContext;
  constructor(props) {
    super(props);

    this.state = {
      actions: {},
      links: {},
    };

    this.getOutportLinks = this.getOutportLinks.bind(this);
    this.updateConnectedInports = this.updateConnectedInports.bind(this);
    this.getActionLinks = this.getActionLinks.bind(this);
  }

  saveToFile(event) {
    event.preventDefault();
    let workflow = { actions: [], links: [] };

    for (const action of Object.values(this.state.actions)) {
      workflow.actions.push({
        type: action.type.name,
        props: action.props,
      });
    }

    for (const link of Object.values(this.state.links)) {
      workflow.links.push({
        props: link.props,
      });
    }

    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(workflow));

    var link = document.createElement("a");
    link.download = "workflow.json";
    link.href = dataStr;
    link.click();
    link.remove();
  }

  loadFromFile(event) {
    var reader = new FileReader();

    // This callback is run when the file loads
    reader.onload = (event) => {
      const workflow = JSON.parse(event.target.result);
      let newActionObject = {};
      let newLinkObject = {};

      // Load the actions
      for (const action of workflow.actions) {
        newActionObject[action.props.id] = React.createElement(
          Actions[action.type],
          Object.assign(action.props, { key: action.props.id })
        );
      }

      // Load the links
      for (const link of workflow.links) {
        newLinkObject[link.props.id] = React.createElement(
          Link,
          Object.assign(link.props, { key: link.props.id })
        );
      }

      this.setState({ actions: newActionObject });
      this.setState({ links: newLinkObject });
    };

    reader.readAsText(event.target.files[0]);
  }
  /**
   * @param {Object} position
   * @param {String} actionID
   *
   * Allows us to keep track of the action positioning so we can place them
   * correctly when loading a saved workflow. Adds the position deltas as
   * an action property.
   */
  actionPositionCallback(position, actionID) {
    // Clone the action element and add the position deltas as a prop
    let newAction = React.cloneElement(this.state.actions[actionID], {
      positionDeltas: position,
    });

    // Update the action object in the state
    this.setState({
      actions: Object.assign(this.state.actions, { [actionID]: newAction }),
    });
  }

  getOutportLinks(outportID) {
    // Returns all of the links connected to an outport
    let linkList = [];
    for (const link of Object.keys(this.state.links)) {
      let split = link.split("_");
      if (split.slice(3).join("_") === outportID) linkList.push(link);
    }
    return linkList;
  }

  getInportLinks(inportID) {
    // Returns all of the links connected to an inport
    let linkList = [];
    for (const link of Object.keys(this.state.links)) {
      let split = link.split("_");
      if (split.slice(0, 3).join("_") === inportID) linkList.push(link);
    }
    return linkList;
  }

  getActionLinks(actionID) {
    // Returns all of the links connected to an action
    let linkList = [];
    for (const link of Object.keys(this.state.links)) {
      let split = link.split("_");
      if (split[0] === actionID) linkList.push(link);
      if (split[3] === actionID) linkList.push(link);
    }

    return linkList;
  }

  updateOutportLinks(connectedLinks, outportData, centerPt) {
    // Adds the data to each connected link as a prop
    for (const linkID of connectedLinks) {
      let newLink = React.cloneElement(this.state.links[linkID], {
        data: outportData,
        startx: centerPt.x,
        starty: centerPt.y,
      });

      this.setState({
        links: Object.assign(this.state.links, { [linkID]: newLink }),
      });
    }
  }

  updateInportLinks(connectedLinks, centerPt) {
    // Adds the data to each connected link as a prop
    for (const linkID of connectedLinks) {
      let newLink = React.cloneElement(this.state.links[linkID], {
        endx: centerPt.x,
        endy: centerPt.y,
      });

      this.setState({
        links: Object.assign(this.state.links, { [linkID]: newLink }),
      });
    }
  }

  updateConnectedInports(connectedLinks, data) {
    // Sends the data to the connected inports
    for (const linkID of connectedLinks) {
      const split = linkID.split("_");

      const payload = {
        targetActionID: split[0],
        targetInportID: split[2],
        data: data,
        timestamp: Math.floor(Date.now()),
      };

      let newAction = React.cloneElement(
        this.state.actions[payload.targetActionID],
        {
          payload: payload,
          key: payload.targetActionID + "_" + String(Date.now()),
        }
      );

      this.setState({
        actions: Object.assign(this.state.actions, {
          [payload.targetActionID]: newAction,
        }),
      });
    }
  }

  inportUpdatedCallback(inportID, centerPt) {
    const connectedLinks = this.getInportLinks(inportID);
    this.updateInportLinks(connectedLinks, centerPt);
  }

  outportUpdatedCallback(outportID, outportData, centerPt) {
    const connectedLinks = this.getOutportLinks(outportID);
    this.updateOutportLinks(connectedLinks, outportData, centerPt);
    this.updateConnectedInports(connectedLinks, outportData);
  }

  outportLinkStarted(outportID, centerPt, data) {
    // outportID: the outport ID of the the outport we are dragging out of
    // centerPt: the center point of the outport
    var mouseupCallback = (e) => {
      if (e.target.classList[0] !== "inport") {
        document.removeEventListener("mousemove", mousemoveCallback);
        document.removeEventListener("mouseup", mouseupCallback);
        let temp = this.state.links;
        delete temp.linkInProgress;
        // here's where we should do a type check
        this.setState({ links: temp });
        return;
      }

      const linkID = `${e.target.dataset.id}_${outportID}`;
      let rect = e.target.getBoundingClientRect();

      const newLink = {
        [linkID]: (
          <Link
            startx={centerPt.x}
            starty={centerPt.y}
            endx={rect.left + rect.width / 2}
            endy={rect.top + rect.height / 2}
            key={uuidv4()}
            id={linkID}
          />
        ),
      };

      let temp = this.state.links;
      delete temp.linkInProgress;
      temp = Object.assign(this.state.links, newLink);

      this.setState({ links: temp });
      document.removeEventListener("mousemove", mousemoveCallback);
      document.removeEventListener("mouseup", mouseupCallback);

      this.updateConnectedInports([linkID], data);
    };

    var mousemoveCallback = (e) => {
      const newLink = {
        linkInProgress: (
          <Link
            startx={centerPt.x}
            starty={centerPt.y}
            endx={e.clientX}
            endy={e.clientY}
            key={"inprogress"}
          />
        ),
      };
      this.setState({ links: Object.assign(this.state.links, newLink) });
    };

    document.addEventListener("mousemove", mousemoveCallback);
    document.addEventListener("mouseup", mouseupCallback);
  }

  inportLinkStarted(inportID, centerPt) {
    var mouseupCallback = (e) => {
      if (e.target.classList[0] !== "outport") {
        document.removeEventListener("mousemove", mousemoveCallback);
        document.removeEventListener("mouseup", mouseupCallback);
        let temp = this.state.links;
        delete temp.linkInProgress;
        this.setState({ links: temp });
        return;
      }

      const linkID = `${inportID}_${e.target.dataset.id}`;
      let rect = e.target.getBoundingClientRect();

      const newLink = {
        [linkID]: (
          <Link
            startx={rect.left + rect.width / 2}
            starty={rect.top + rect.height / 2}
            endx={centerPt.x}
            endy={centerPt.y}
            key={uuidv4()}
            id={linkID}
          />
        ),
      };
      let temp = this.state.links;
      delete temp.linkInProgress;
      temp = Object.assign(this.state.links, newLink);

      this.setState({ links: temp });
      document.removeEventListener("mousemove", mousemoveCallback);
      document.removeEventListener("mouseup", mouseupCallback);
    };

    var mousemoveCallback = (e) => {
      const newLink = {
        linkInProgress: (
          <Link
            startx={e.clientX}
            starty={e.clientY}
            endx={centerPt.x}
            endy={centerPt.y}
            key={"inprogress"}
          />
        ),
      };
      this.setState({ links: Object.assign(this.state.links, newLink) });
    };

    document.addEventListener("mouseup", mouseupCallback);
    document.addEventListener("mousemove", mousemoveCallback);
  }

  // TODO: We could modify the position deltas here to stagger the components as they are added
  addAction(action) {
    const uniqueID = uuidv4();
    const newAction = {
      [uniqueID]: React.createElement(
        action,
        {
          key: uniqueID + "_" + String(Date.now()),
          id: uniqueID,
          positionDeltas: { x: 0, y: 0 },
          payload: { data: { data: null } },
        },
        null
      ),
    };

    this.setState({ actions: Object.assign(this.state.actions, newAction) });
  }

  removeAction(actionID) {
    let actions = this.state.actions;
    delete actions[actionID];
    // Remove the action from the action state
    this.setState({ actions: actions });

    // Remove links connected to it
    const linksToRemove = this.getActionLinks(actionID);
    let links = this.state.links;
    for (const link of linksToRemove) {
      delete links[link];
    }
    this.setState({ links: links });
  }

  renderButtons() {
    let buttonList = [];

    for (const value of Object.values(Actions)) {
      buttonList.push(
        <div key={value.name}>
          <div
            type="button"
            className="dropdownAction"
            onClick={this.addAction.bind(this, value)}
          >
            {value.name}
          </div>
        </div>
      );
    }

    return buttonList;
  }

  renderActions() {
    let actionList = [];
    for (const value of Object.values(this.state.actions)) {
      actionList = actionList.concat(value);
    }

    return actionList;
  }

  renderLinks() {
    let linkList = [];
    for (const value of Object.values(this.state.links)) {
      linkList = linkList.concat(value);
    }
    return linkList;
  }

  componentDidMount() {
    const { global, setGlobal } = this.context;
    var newGlobal = { ...global }; // Create a deep copy of the global context

    // These are callbacks that should be global, because we don't want to have to access
    // them via prop drilling. You also will not have to deal with them when adding new
    // actions because they're global.
    Object.assign(newGlobal, {
      startOutportLink: this.outportLinkStarted.bind(this),
      startInportLink: this.inportLinkStarted.bind(this),
      outportUpdatedCallback: this.outportUpdatedCallback.bind(this),
      inportUpdatedCallback: this.inportUpdatedCallback.bind(this),
      actionPositionCallback: this.actionPositionCallback.bind(this),
      removeAction: this.removeAction.bind(this),
    });

    setGlobal(newGlobal); // Set the global context
  }

  render() {
    return (
      <React.Fragment>
        {this.renderLinks()}

        <div
          className="toolbarContainer"
          sx={{
            backgroundColor: "toolbar",
            color: "toolbarText",
          }}
        >
          <span id="toolbarTitle" className="unselectable">
            planager
          </span>
          <span
            className="toolbarButton"
            onClick={this.saveToFile.bind(this)}
            title="Save workflow"
            sx={{
              ":hover": {
                backgroundColor: "toolbarText",
                color: "toolbar",
              },
            }}
          >
            <VscSave className="toolbarIcon" />
          </span>
          <label
            className="toolbarButton"
            title="Load workflow"
            sx={{
              ":hover": {
                backgroundColor: "toolbarText",
                color: "toolbar",
              },
            }}
          >
            <VscCloudUpload className="toolbarIcon" />
            <input
              type="file"
              name="resume"
              onChange={this.loadFromFile.bind(this)}
            />
          </label>
          <span
            className="toolbarButton addAction"
            title="Add an action"
            sx={{
              ":hover": {
                backgroundColor: "toolbarText",
                color: "toolbar",
              },
            }}
          >
            <VscAdd className="toolbarIcon" />
            <div className="actionDropdownContainer">
              {this.renderButtons()}
            </div>
          </span>
          <span
            className="toolbarButton"
            id="toolbarSettings"
            sx={{
              ":hover": {
                backgroundColor: "toolbarText",
                color: "toolbar",
              },
            }}
          >
            <ToggleColorMode>
              <BsGearFill className="toolbarIcon" />
            </ToggleColorMode>
          </span>
        </div>
        <div>{this.renderActions()}</div>
      </React.Fragment>
    );
  }
}
