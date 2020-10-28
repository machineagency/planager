import React, { Component } from "react";

const WorkflowContext = React.createContext();

class WorkflowProvider extends Component {
  // Context state
  state = {
    workflow: {
      workflowActions: [],
      workflowLinks: [],
    },
  };

  // Method to update state
  setWorkflow = (key, val) => {
    var workflow  = {...this.state.workflow}
    workflow[key] = val;
    this.setState({workflow})
  };

  render() {
    const { children } = this.props;
    const { workflow } = this.state;
    const { setWorkflow } = this;

    return (
      <WorkflowContext.Provider
        value={{
          workflow,
          setWorkflow,
        }}
      >
        {children}
      </WorkflowContext.Provider>
    );
  }
}

export default WorkflowContext;

export { WorkflowProvider };
