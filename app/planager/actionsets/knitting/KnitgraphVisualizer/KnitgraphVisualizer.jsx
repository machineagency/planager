import React from "react";
import Graph from "react-graph-vis";

import "./KnitgraphVisualizer.css";

const options = {
  layout: {
    hierarchical: true,
  },
};

export default class KnitgraphVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: undefined,
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
  drawGraph() {
    if (!this.state.graph) return;
    console.log(this.state.graph);
    try {
      const graph = {
        nodes: this.state.graph.nodes,
        edges: this.state.graph.edges,
      };
      return (
        <Graph graph={graph} options={options} style={{ height: "640px" }} />
      );
    } catch (error) {
      return;
    }
  }
  render() {
    return (
      <div id='knitgraphVisualizer'>
        {this.drawGraph()}
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
