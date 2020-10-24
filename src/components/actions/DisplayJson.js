import React from 'react'
import Draggable from 'react-draggable'

export default class DisplayJson extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      next: null
    }
  }

  execute() {
    console.log("displayjson executed")
  }


  render() {
    return (
      <Draggable>
      <div className="box">
        displayjson
      </div>
      </Draggable>
    );
  }
}
