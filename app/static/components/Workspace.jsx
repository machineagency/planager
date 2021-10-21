import React from "react";

import Action from "./Action";
import Link from "./Link";

import "./styles/workspace.css";

export default class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plan: "undefined",
      actionList: [],
      examples: [],
      flow: [],
      links: {},
      start: {},
    };
    fetch("/getActions", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        this.setState({ actionList: result.actions });
      });
    fetch("clearPlan", { method: "get" });
    this.mousemoveCallback = this.mousemoveCallback.bind(this);
  }
  uploadPlan(event) {
    var reader = new FileReader();

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
  }
  mousemoveCallback(e) {
    let start = this.state.start;
    const newLink = {
      linkInProgress: (
        <Link
          startActionID={start.startActionID}
          startPortID={start.startPortID}
          startx={start.x}
          starty={start.y}
          endx={e.clientX}
          endy={e.clientY}
          key={"inprogress"}
        />
      ),
    };
    this.setState({ links: Object.assign(this.state.links, newLink) });
  }

  beginConnection(e, startActionID, startPortID) {
    let rect = e.target.getBoundingClientRect();
    const start = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      startActionID: startActionID,
      startPortID: startPortID,
    };

    const newLink = {
      linkInProgress: (
        <Link
          startx={start.x}
          starty={start.y}
          endx={e.clientX}
          endy={e.clientY}
          key={"inprogress"}
        />
      ),
    };

    document.addEventListener("mousemove", this.mousemoveCallback);
    this.setState({
      start: start,
      links: Object.assign(this.state.links, newLink),
    });
  }

  endConnection(e, endActionID, endPortID) {
    const linky = this.state.links.linkInProgress;
    if (!linky) return;

    fetch("/addLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startActionID: linky.props.startActionID,
        startPortID: linky.props.startPortID,
        endActionID: endActionID,
        endPortID: endPortID,
      }),
    })
      .then((res) => res.json())
      .then((plan) => {
        this.setState({ plan: plan }, this.updatePlan);
      });

    let oldLinks = this.state.links;
    delete oldLinks.linkInProgress;
    this.setState({ links: oldLinks });
    document.removeEventListener("mousemove", this.mousemoveCallback);
  }

  renderLinks() {
    let renderedLinks = [];
    for (const [_, link] of Object.entries(this.state.links)) {
      renderedLinks.push(link);
    }
    return renderedLinks;
  }

  updatePlan() {
    let actionList = [];
    let newLinks = {};
    for (const action of this.state.plan.actions) {
      let actionRef = React.createRef();
      let newAction = (
        <Action
          action={action}
          inports={action.inports}
          outports={action.outports}
          beginConnection={this.beginConnection.bind(this)}
          endConnection={this.endConnection.bind(this)}
          key={action.id.hex}
          coords={{ x: 500, y: 500 }}
          ref={actionRef}
        />
      );
      actionList.push(newAction);

      for (const [outportID, link] of Object.entries(action.links)) {
        // TODO: Figure out how to get the proper coordinates here. might need to break this out into a callback function that runs after actions are loaded
        const newID = `${action.id.hex}_${outportID}_${link.endActionID}_${link.endPortID}`;
        // const coords = actionRef.current.getOutportCoords();
        newLinks[newID] = (
          <Link
            // startx={coords.x}
            // starty={coords.y}
            // startx={coords[outportID].x}
            // starty={coords[outportID].y}
            startx={1000}
            starty={1000}
            endx={2000}
            endy={2000}
            key={newID}
          />
        );
      }

      // actionList.push(newAction);
    }
    this.setState({
      flow: actionList,
      links: Object.assign(this.state.links, newLinks),
    });
  }
  addAction(act) {
    fetch("/addAction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(act),
    })
      .then((res) => res.json())
      .then((plan) => {
        this.setState({ plan: plan }, this.updatePlan);
      });
  }
  loadExample(example) {
    console.log("loading an example");
    console.log(example);
  }
  renderActionDropdown() {
    // TODO: Make a react dropdown component
    let actionList = [];

    for (const action of this.state.actionList) {
      actionList.push(
        <div key={action}>
          <div
            type='button'
            className='dropdownAction'
            onClick={this.addAction.bind(this, action)}>
            {action}
          </div>
        </div>
      );
    }

    return actionList;
  }
  renderExampleDropdown() {
    // TODO: Make a react dropdown component
    let exampleList = [];

    for (const value of this.state.examples) {
      exampleList.push(
        <div key={value}>
          <div
            type='button'
            className='dropdownAction'
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
          <label title='Load plan' className='toolbarButton unselectable'>
            Upload
            <input type='file' onChange={this.uploadPlan.bind(this)} />
          </label>
          <span className='relative'>
            <span
              title='Actions'
              className='toolbarButton unselectable addAction'>
              Actions
              <div className='actionDropdownContainer'>
                {this.renderActionDropdown()}
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
          {this.state.flow}
        </div>
      </div>
    );
  }
}
