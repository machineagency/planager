import React from "react";
import "./KnitspeakToKnitgraph.css";

export default class KnitspeakToKnitgraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: true,
    };
  }
  compile() {
    fetch("/runBackendMethod", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "compile", // The method to run
        actionID: this.props.action.id,
        args: {},
      }),
    })
      .then((res) => res.json())
      .then((asdf) => {
        console.log(asdf);
      });
  }
  render() {
    return (
      <div>
        <div
          type='button'
          onClick={this.compile.bind(this)}
          className='compileButton'>
          Compile
        </div>
      </div>
    );
  }
}
