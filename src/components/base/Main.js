import React from "react";
import { v4 as uuidv4 } from "uuid";
import Link from "./Link";
import * as Actions from "../actions/ActionLoader";
import "./styles/main.css";
import GlobalContext from "../../utils/GlobalContext";

export default class Main extends React.Component {
  static contextType = GlobalContext;
  constructor(props) {
    super(props);

    this.state = {
      actions: {},
      links: {},
    };

    this.getOutportLinks = this.getOutportLinks.bind(this);
    this.updateLinks = this.updateLinks.bind(this);
    this.updateConnectedInports = this.updateConnectedInports.bind(this);
  }

  saveToFile(event) {
    event.preventDefault();
    let workspace = { actions: [], links: [] };

    for (const action of Object.values(this.state.actions)) {
      workspace.actions.push({
        type: action.type.name,
        props: action.props,
      });
    }

    for (const link of Object.values(this.state.links)) {
      workspace.links.push({
        props: link.props,
      });
    }
  }

  loadFromFile(event) {
    console.log(this.state);
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
          action.props
        );
      }

      // Load the links
      for (const link of workflow.links) {
        newLinkObject[link.props.id] = React.createElement(
          Link,
          link.props
        );
      }

      this.setState({ actions: newActionObject });
      this.setState({ links: newLinkObject });
    };

    reader.readAsText(event.target.files[0]);
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

  updateLinks(connectedLinks, outportData, deltas) {
    // Adds the data to each connected link as a prop
    for (const linkID of connectedLinks) {
      let newLink = React.cloneElement(this.state.links[linkID], {
        data: outportData,
        deltastartx: deltas.x,
        deltastarty: deltas.y,
      });

      this.setState({
        links: Object.assign(this.state.links, { [linkID]: newLink }),
      });
    }
  }

  updateInportLinks(connectedLinks, deltas) {
    // Adds the data to each connected link as a prop
    for (const linkID of connectedLinks) {
      let newLink = React.cloneElement(this.state.links[linkID], {
        deltaendx: deltas.x,
        deltaendy: deltas.y,
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
        }
      );

      this.setState({
        actions: Object.assign(this.state.actions, {
          [payload.targetActionID]: newAction,
        }),
      });
    }
  }

  inportUpdatedCallback(inportID, deltas) {
    const connectedLinks = this.getInportLinks(inportID);
    this.updateInportLinks(connectedLinks, deltas);
  }

  outportUpdatedCallback(outportID, outportData, deltas) {
    const connectedLinks = this.getOutportLinks(outportID);
    this.updateLinks(connectedLinks, outportData, deltas);
    this.updateConnectedInports(connectedLinks, outportData);
  }

  /**
   * Gets computed translate values
   * @param {HTMLElement} element
   * @returns {Object}
   */
  getTranslateValues(element) {
    const style = window.getComputedStyle(element);
    const matrix =
      style["transform"] || style.webkitTransform || style.mozTransform;

    // No transform property. Simply return 0 values.
    if (matrix === "none") {
      return {
        x: 0,
        y: 0,
        z: 0,
      };
    }

    // Can either be 2d or 3d transform
    const matrixType = matrix.includes("3d") ? "3d" : "2d";
    const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");

    // 2d matrices have 6 values
    // Last 2 values are X and Y.
    // 2d matrices does not have Z value.
    if (matrixType === "2d") {
      return {
        x: Number(matrixValues[4]),
        y: Number(matrixValues[5]),
        z: 0,
      };
    }

    // 3d matrices have 16 values
    // The 13th, 14th, and 15th values are X, Y, and Z
    if (matrixType === "3d") {
      return {
        x: Number(matrixValues[12]),
        y: Number(matrixValues[13]),
        z: Number(matrixValues[14]),
      };
    }
  }

  outportLinkStarted(outportEvent, outportID, deltas, data) {
    // outportEvent: the drag event from the outport
    // outportID: the outport ID of the the outport we are dragging out of
    // deltas: the Deltaposition of the generic action
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
      const inportDeltas = this.getTranslateValues(e.target.offsetParent);

      const newLink = {
        [linkID]: (
          <Link
            startx={outportEvent.clientX - deltas.x}
            starty={outportEvent.clientY - deltas.y}
            deltastartx={deltas.x}
            deltastarty={deltas.y}
            endx={e.clientX - inportDeltas.x}
            endy={e.clientY - inportDeltas.y}
            deltaendx={inportDeltas.x}
            deltaendy={inportDeltas.y}
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
            startx={outportEvent.clientX - deltas.x}
            starty={outportEvent.clientY - deltas.y}
            deltastartx={deltas.x}
            deltastarty={deltas.y}
            endx={e.clientX}
            endy={e.clientY}
            deltaendx={0}
            deltaendy={0}
            key={"inprogress"}
          />
        ),
      };
      this.setState({ links: Object.assign(this.state.links, newLink) });
    };

    document.addEventListener("mousemove", mousemoveCallback);
    document.addEventListener("mouseup", mouseupCallback);
  }

  inportLinkStarted(inportEvent, inportID, deltas) {
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
      const outportDeltas = this.getTranslateValues(e.target.offsetParent);

      const newLink = {
        [linkID]: (
          <Link
            startx={e.clientX - outportDeltas.x}
            starty={e.clientY - outportDeltas.y}
            deltastartx={outportDeltas.x}
            deltastarty={outportDeltas.y}
            endx={inportEvent.clientX - deltas.x}
            endy={inportEvent.clientY - deltas.y}
            deltaendx={deltas.x}
            deltaendy={deltas.y}
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
            deltastartx={0}
            deltastarty={0}
            endx={inportEvent.clientX - deltas.x}
            endy={inportEvent.clientY - deltas.y}
            deltaendx={deltas.x}
            deltaendy={deltas.y}
            key={"inprogress"}
          />
        ),
      };
      this.setState({ links: Object.assign(this.state.links, newLink) });
    };

    document.addEventListener("mouseup", mouseupCallback);
    document.addEventListener("mousemove", mousemoveCallback);
  }

  addAction(action) {
    const uniqueID = uuidv4();
    const newAction = {
      [uniqueID]: React.createElement(
        action,
        { key: uniqueID, id: uniqueID },
        null
      ),
    };

    this.setState({ actions: Object.assign(this.state.actions, newAction) });
  }

  renderButtons() {
    let buttonList = [];

    for (const value of Object.values(Actions)) {
      buttonList.push(
        <>
          <input
            type="button"
            className="addActionButton planagerButton"
            onClick={this.addAction.bind(this, value)}
            key={value.name}
            value={value.name}
          />
          <br />
        </>
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

    // Assign the linking functions to it so they can be accessed anywhere without prop drilling
    Object.assign(newGlobal, {
      startOutportLink: this.outportLinkStarted.bind(this),
      startInportLink: this.inportLinkStarted.bind(this),
      outportUpdatedCallback: this.outportUpdatedCallback.bind(this),
      inportUpdatedCallback: this.inportUpdatedCallback.bind(this),
    });

    setGlobal(newGlobal); // Set the global context
  }

  render() {
    return (
      <>
        {/* This is react fragment syntax, which prevents extra divs from being added to the DOM}*/}
        {this.renderLinks()}

        <div className="buttonContainer">
          <input
            type="button"
            className="planagerButton violet"
            onClick={this.saveToFile.bind(this)}
            key="save"
            value="Save Workflow"
          />
          <input
            type="file"
            onChange={this.loadFromFile.bind(this)}
            key="load"
          />
          <br />
          {this.renderButtons()}
        </div>
        {this.renderActions()}
      </>
    );
  }
}
