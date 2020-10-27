import React, { Component } from 'react'

const WorkflowContext = React.createContext()

class WorkflowProvider extends Component {
  // Context state
  state = {
    workflow: {
      workflowActions: [],
      actionQueue: [],
      links: {}
    },
  }

  // Method to update state
  setWorkflow = (workflow) => {
    this.setState((prevState) => ({ workflow }))
  }

  render() {
    const { children } = this.props
    const { workflow } = this.state
    const { setWorkflow } = this

    return (
      <WorkflowContext.Provider
        value={{
          workflow,
          setWorkflow,
        }}
      >
        {children}
      </WorkflowContext.Provider>
    )
  }
}

export default WorkflowContext


export { WorkflowProvider }