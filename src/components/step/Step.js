import React from 'react'

export default class Step extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    	WorkflowTitle: "unnamed" 
    }
  }

  render() {
    return (
      <div>
        {this.state.WorkflowTitle}
      </div>
    );
  }
}
