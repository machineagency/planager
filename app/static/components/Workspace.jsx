import React from "react";

import Action from "./Action";

import "./styles/workspace.css";

export default class Workspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plan: "undefined",
      actions: [],
      links: [],
      actionList: [],
      examples: [],
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
  }
  uploadPlan(event) {
    var reader = new FileReader();

    // This callback is run when the file loads
    reader.onload = (event) => {
      const workflow = JSON.parse(event.target.result);
      fetch("/uploadPlan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workflow),
      })
        .then((res) => res.json())
        // Todo: check for plan correctness in the backend and return the appropriate code
        .then((result) => {
          console.debug(result);
          this.setState({ plan: workflow }, this.updatePlan);
        });
    };
    reader.readAsText(event.target.files[0]);
  }
  updatePlan() {
    let actionList = [];
    for (const action of this.state.plan.actions) {
      actionList.push(
        <Action
          name={action.name}
          inports={action.inports}
          outports={action.outports}
          coords={action.coords}
          key={action.name + action.id}
        />
      );
    }
    this.setState({ actions: actionList });
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
      .then((result) => {
        console.debug(result);
      });
  }
  loadExample(example) {
    console.log("loading an example");
    console.log(example);
  }
  renderActionDropdown() {
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
        <div id='workflowCanvas'>{this.state.actions}</div>
      </div>
    );
  }
}
