import React from "react";

import "./Upload.css";

export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: null,
      fileType: null,
    };
  }
  uploadFile(event) {
    var reader = new FileReader();

    // This callback is run when the file loads
    reader.onload = (event) => {
      const plan = JSON.parse(event.target.result);
      fetch("/uploadPlan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plan),
      })
        .then((res) => res.json())
        .then((result) => {
          console.debug(result);
          this.setState({ plan: plan }, this.updatePlan);
        });
    };
    reader.readAsText(event.target.files[0]);
  }
  backendMethod() {
    fetch("/runBackendMethod", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "templateActionMethod",
        actionID: this.props.action.id,
      }),
    })
      .then((res) => res.json())
      .then((asdf) => {
        console.log(asdf);
      });
  }
  render() {
    return (
      <button class='custom-file-upload'>
        <input type='file' />
        Custom Upload
      </button>
    );
  }
}
