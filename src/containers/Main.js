import React from "react";
import { Button } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";

// Import Components
import Alert from "../components/actions/Alert";
import Constant from "../components/actions/Constant";
import Link from "../components/ui/Link";

import "./Main.css"; // Top-level styles
import GlobalContext from "../utils/GlobalContext";

export default class Main extends React.Component {
  static contextType = GlobalContext;
  constructor(props) {
    super(props);

    this.state = {
      actions: {},
      links: {},
    };

    this.getLinks = this.getLinks.bind(this);
    this.updateLinksWithOutportData = this.updateLinksWithOutportData.bind(
      this
    );
    this.updateConnectedInports = this.updateConnectedInports.bind(this);
  }

  getLinks(outportID) {
    // Returns all of the links connected to an outport
    let linkList = [];
    for (const link of Object.keys(this.state.links)) {
      let split = link.split("_");
      if (split[3] === outportID.split("_")[0]) linkList.push(link);
    }
    return linkList;
  }

  updateLinksWithOutportData(connectedLinks, outportData) {
    // Adds the data to each connected link as a prop
    for (const linkID of connectedLinks) {
      let newLink = React.cloneElement(this.state.links[linkID], {
        data: outportData,
      });
      this.setState({
        links: Object.assign(this.state.links, { [linkID]: newLink }),
      });
    }
  }

  updateConnectedInports(connectedLinks, data) {
    // Sends the data to the connected inports
    for (const link of connectedLinks) {
      let split = link.split("_");
      const actionID = split[0];
      const inportID = split[2];
      let newAction = React.cloneElement(this.state.actions[actionID], {
        inportData: { [inportID]: data },
      });
      this.setState({
        actions: Object.assign(this.state.actions, { [actionID]: newAction }),
      });
    }
  }

  outportUpdatedCallback(outportID, outportData) {
    const connectedLinks = this.getLinks(outportID);
    this.updateLinksWithOutportData(connectedLinks, outportData);
    this.updateConnectedInports(connectedLinks, outportData);
  }

  outportLinkStarted(outportEvent, outportID) {
    var mouseupCallback = (e) => {
      if (e.target.classList[0] !== "inport") {
        document.removeEventListener("mousemove", mousemoveCallback);
        document.removeEventListener("mouseup", mouseupCallback);
        let temp = this.state.links;
        delete temp.linkInProgress;
        this.setState({ links: temp });
        return;
      }

      const linkID = `${e.target.dataset.id}_${outportID}`;
      const newLink = {
        [linkID]: (
          <Link
            startx={outportEvent.clientX}
            starty={outportEvent.clientY}
            endx={e.clientX}
            endy={e.clientY}
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
            startx={outportEvent.clientX}
            starty={outportEvent.clientY}
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

  inportLinkStarted(inportEvent, inportID) {
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
      const newLink = {
        [linkID]: (
          <Link
            startx={inportEvent.clientX}
            starty={inportEvent.clientY}
            endx={e.clientX}
            endy={e.clientY}
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
            startx={inportEvent.clientX}
            starty={inportEvent.clientY}
            endx={e.clientX}
            endy={e.clientY}
            key={"inprogress"}
          />
        ),
      };
      this.setState({ links: Object.assign(this.state.links, newLink) });
    };

    document.addEventListener("mouseup", mouseupCallback);
    document.addEventListener("mousemove", mousemoveCallback);
  }

  addAlert() {
    const uniqueID = uuidv4();
    const newAction = { [uniqueID]: <Alert key={uniqueID} id={uniqueID} /> };
    this.setState({ actions: Object.assign(this.state.actions, newAction) });
  }

  addConstant() {
    const uniqueID = uuidv4();
    const newAction = { [uniqueID]: <Constant key={uniqueID} id={uniqueID} /> };
    this.setState({ actions: Object.assign(this.state.actions, newAction) });
  }

  renderActions() {
    let actionList = [];
    for (let [key, value] of Object.entries(this.state.actions)) {
      actionList = actionList.concat(value);
    }

    return actionList;
  }

  renderLinks() {
    let linkList = [];
    for (let [key, value] of Object.entries(this.state.links)) {
      linkList = linkList.concat(value);
    }
    return linkList;
  }

  componentDidMount() {
    const { global, setGlobal } = this.context;
    var newGlobal = { ...global }; // Create a shallow copy of the global context

    // Assign the linking functions to it so they can be accessed anywhere without prop drilling
    Object.assign(newGlobal, {
      startOutportLink: this.outportLinkStarted.bind(this),
      startInportLink: this.inportLinkStarted.bind(this),
      outportUpdatedCallback: this.outportUpdatedCallback.bind(this),
    });

    setGlobal(newGlobal); // Replace the old global context with the new one
  }

  render() {
    return (
      <>
        {/* This is react fragment syntax, which prevents extra divs from being added to the DOM}*/}
        {this.renderLinks()}
        <div className="buttonContainer">
          <Button
            className="ui button"
            size="mini"
            onClick={this.addAlert.bind(this)}
          >
            Alert
          </Button>
          <Button
            className="ui button"
            size="mini"
            onClick={this.addConstant.bind(this)}
          >
            Constant
          </Button>
        </div>
        {this.renderActions()}
      </>
    );
  }
}
