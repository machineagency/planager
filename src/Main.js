import React from 'react'
import ReactDOM from 'react-dom'
import TheGraph from 'the-graph'

import './Main.css'


export default class Main extends React.Component {
  constructor(props) {
    super(props)

    // Methods
    this.addNode = this.addNode.bind(this)
    this.random = this.random.bind(this)
    this.getGraph = this.getGraph.bind(this)
    this.clear = this.clear.bind(this)
    this.addEdge = this.addEdge.bind(this)
    this.renderEditor = this.renderEditor.bind(this)

    // References
    this.editorRef = React.createRef()

    // Initialize Graph
    this.graph = new TheGraph.fbpGraph.Graph()
  }

  random() {
    this.graph.startTransaction('randomgraph');
    for (var i=0; i<10; i++) {
      this.addNode();
      this.addEdge();
      this.addEdge();
    }
    this.graph.endTransaction('randomgraph');
  }

  addNode() {
    var id = Math.round(Math.random()*100000).toString(36);
    var component = Math.random() > 0.5 ? 'aspirate' : 'dispense';
    var metadata = {
      label: component,
      x: Math.round(Math.random()*800),
      y: Math.round(Math.random()*600)
    };
    var newNode = this.graph.addNode(id, component, metadata);
    return newNode;
  };

  addEdge() {
    var nodes = this.graph.nodes;
    var len = nodes.length;
    if ( len<1 ) { return; }
    var node1 = nodes[Math.floor(Math.random()*len)].id;
    var node2 = nodes[Math.floor(Math.random()*len)].id;
    var port1 = 'out' + Math.floor(Math.random()*3);
    var port2 = 'in' + Math.floor(Math.random()*12);
    var meta = { route: Math.floor(Math.random()*10) };
    var newEdge = this.graph.addEdge(node1, port1, node2, port2, meta);
    return newEdge;
  }

  getGraph() {
    var graphJSON = JSON.stringify(this.graph.toJSON(), null, 2);
    alert(graphJSON);
  }

  clear() {
    this.graph = new TheGraph.fbpGraph.Graph();
    this.renderEditor();
  }

  renderEditor() {
    var library = {
      aspirate: {
        name: 'aspirate',
        description: 'basic demo component',
        icon: 'eye',
        inports: [
          {'name': 'in0', 'type': 'all'},
          {'name': 'in1', 'type': 'all'},
          {'name': 'in2', 'type': 'all'}
        ],
        outports: [
          {'name': 'out', 'type': 'all'}
        ]
      },
      dispense: {
        name: 'dispense',
        description: 'tall demo component',
        icon: 'cog',
        inports: [
          {'name': 'in0', 'type': 'all'},
          {'name': 'in1', 'type': 'all'},
          {'name': 'in2', 'type': 'all'},
          {'name': 'in3', 'type': 'all'},
          {'name': 'in4', 'type': 'all'},
          {'name': 'in5', 'type': 'all'},
        ],
        outports: [
          {'name': 'out0', 'type': 'all'}
        ]
      }
    };

    var props = {
        readonly: false,
        height: window.innerHeight,
        width: window.innerWidth,
        graph: this.graph,
        library: library,
    };

    var element = React.createElement(TheGraph.App, props);
    ReactDOM.render(element, this.editorRef.current);
  }

  componentDidMount() {
    this.renderEditor()
    this.graph.on('endTransaction', this.renderEditor);
  }

  render() {
    return (
      <div className="Main">
          <div id="editor" ref={this.editorRef} class="the-graph-dark"></div>
          <div id="buttonContainer">
            <button onClick={this.random}>Make a Random Graph</button>
            <button onClick={this.addNode}>Add a Node!</button>
            <button onClick={this.addEdge}>Add an Edge!</button>
            <button onClick={this.getGraph}>Get Graph!</button>
            <button onClick={this.clear}>Clear!</button>
          </div>
      </div>
    );
  }
}
