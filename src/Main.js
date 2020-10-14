import React from 'react'
import ReactDOM from 'react-dom'
import TheGraph from 'the-graph'
import './Main.css'
import { Button } from 'semantic-ui-react'


export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.addNode = this.addNode.bind(this)
    this.editorRef = React.createRef()
    this.graph = new TheGraph.fbpGraph.Graph()
    this.state = {
      WorkflowTitle: "unnamed" 
    }
  }

  addNode() {
    console.log("hello there")
    var id = Math.round(Math.random()*100000).toString(36);
    var component = Math.random() > 0.5 ? 'basic' : 'tall';
    var metadata = {
      label: component,
      x: Math.round(Math.random()*800),
      y: Math.round(Math.random()*600)
    };
    var newNode = this.graph.addNode(id, component, metadata);
    return newNode;
  };

  componentDidMount() {
    var library = {
      basic: {
        name: 'basic',
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
      tall: {
        name: 'tall',
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
        height: 1000,
        width: 1000,
        graph: this.graph,
        library: library,
    };

    // this.editorRef.current.innerHTML = "BLAHJHDFSOKHSDKFLJH"
    var element = React.createElement(TheGraph.App, props);
    ReactDOM.render(element, this.editorRef.current);
  }

  render() {
    return (
      <div className="Main">
        <header className="Main-header">
          <p>Sonication Station</p>
          <button onClick={this.addNode}>Add a Node!</button>
          <div id="editor" ref={this.editorRef}></div>
        </header>
      </div>
    );
  }
}
