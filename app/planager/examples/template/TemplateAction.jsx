import React from "react";

import "./TemplateAction.css";

export default class TemplateAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: true,
    };
  }
  backendMethod() {
    fetch("/runBackendMethod", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "templateActionMethod", // The method to run
        actionID: this.props.action.id,
      }),
    })
      .then((res) => res.json())
      .then((asdf) => {
        console.log(asdf);
      });
  }
  render() {
    return <div className='background'>Content goes here!</div>;
  }
}
