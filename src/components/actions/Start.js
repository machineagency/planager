import React from 'react'
import Draggable from 'react-draggable'
import WorkflowContext from '../../utils/WorkflowContext'

export default class Start extends React.Component {
  static contextType = WorkflowContext // How we access the global context

  constructor(props) {
    super(props)
    this.state = {
      next: null
    }
  }

  run() {
    this.props.parentCallback("this is a message from a child");
  }

  componentDidMount() {
    const user = this.context
    console.log(user)
  }

  componentDidUpdate() {
    const user = this.context
    console.log(user)
    this.run()
  }

  render() {
    return (
      <Draggable>
      <div className="box">
        start
      </div>
      </Draggable>
    );
  }
}
