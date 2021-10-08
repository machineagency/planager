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
    };
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
          console.log(result)
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
  render() {
    return (
      <div id='container'>
        <div id='toolbarContainer'>
          <div id='toolbarTitle' className='unselectable'>
            Planager
          </div>
          <label className='toolbarButton' title='Load plan'>
            Upload Plan
            <input type='file' onChange={this.uploadPlan.bind(this)} />
          </label>
        </div>
        <div id='workflowCanvas'>{this.state.actions}</div>
      </div>
    );
  }
}
