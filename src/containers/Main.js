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
  }

  outportLinkStarted(outportEvent) {
    const uniqueID = uuidv4();

    var mouseupCallback = (e) => {
      const newLink = {
        [uniqueID]: (
          <Link
            startx={outportEvent.clientX}
            starty={outportEvent.clientY}
            endx={e.clientX}
            endy={e.clientY}
            key={uuidv4()}
          />
        ),
      };
      this.setState({ links: Object.assign(this.state.links, newLink) });
      document.removeEventListener("mouseup", mouseupCallback);
      document.removeEventListener("mousemove", mousemoveCallback);
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
    }

    document.addEventListener("mouseup", mouseupCallback);
    document.addEventListener('mousemove', mousemoveCallback);
  }

  inportLinkStarted(inportEvent) {
    const uniqueID = uuidv4();

    var mouseupCallback = (e) => {
      const newLink = {
        [uniqueID]: (
          <Link
            startx={inportEvent.clientX}
            starty={inportEvent.clientY}
            endx={e.clientX}
            endy={e.clientY}
            key={uuidv4()}
          />
        ),
      };
      this.setState({ links: Object.assign(this.state.links, newLink) });
      document.removeEventListener("mouseup", mouseupCallback);
      document.removeEventListener("mousemove", mousemoveCallback);
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
    }

    document.addEventListener("mouseup", mouseupCallback);
    document.addEventListener('mousemove', mousemoveCallback);
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

    Object.assign(newGlobal, {
      // Assign the linking functions to it so they can be accessed anywhere
      startOutportLink: this.outportLinkStarted.bind(this),
      startInportLink: this.inportLinkStarted.bind(this),
    });

    setGlobal(newGlobal); // Replace the old global context with the new one
  }

  render() {
    return (
      <>
        {" "}
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
