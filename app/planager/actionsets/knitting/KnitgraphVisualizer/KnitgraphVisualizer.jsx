import React from "react";
import "./KnitgraphVisualizer.css";

export default class KnitgraphVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: true,
    };
  }
  getGraph() {
    fetch("/runBackendMethod", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "graph", // The method to run
        actionID: this.props.action.id,
        args: {},
      }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        this.setState({ graph: resJson.data });
      });
  }
  render() {
    return (
      <div id='knitgraphVisualizer'>
        <div
          type='button'
          onClick={this.getGraph.bind(this)}
          className='graphButton'>
          Draw Graph
        </div>
      </div>
    );
  }
}
