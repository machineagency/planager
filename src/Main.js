import React from 'react'

// Import Components
import Start from './components/actions/Start'
import SendString from './components/actions/SendString'
import DisplayJson from './components/actions/DisplayJson'

import './Main.css'

import { WorkflowProvider } from './WorkflowContext'


export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      actions: [],
      running: false
    }

    this.addString = this.addString.bind(this)
    this.addJson = this.addJson.bind(this)
    this.addStart = this.addStart.bind(this)
    this.run = this.run.bind(this)
  }

  callbackParent(childData) {
    this.setState({message: childData})
  }

  addStart(event) {
    // Adds an action to the workspace
    const actions = this.state.actions
    this.setState({
      actions: actions.concat(<Start parentCallback={this.callbackParent.bind(this)} key={actions.length} />)
    })
  }

  addString(event) {
    // Adds an action to the workspace
    const actions = this.state.actions
    this.setState({
      actions: actions.concat(<SendString running={false} key={actions.length} />)
    })
  }

  addJson(event) {
    // Adds an action to the workspace
    const actions = this.state.actions
    this.setState({
      actions: actions.concat(<DisplayJson running={false} key={actions.length} />)
    })
  }

  run(event) {
    // console.log(WorkflowContext)
  }

  renderActions() {
    return this.state.actions
  }

  render() {
    return (
      <WorkflowProvider value={{hello: "world"}}>
        <div>
            <div id="buttonContainer">
              <button onClick={this.run}>Run</button>
              <button onClick={this.addStart}>Add start action</button>
              <button onClick={this.addString}>Add string action</button>
              <button onClick={this.addJson}>Add json action</button>
            </div>
            
              {this.renderActions()}
            
        </div>
      </WorkflowProvider>
    );
  }
}
