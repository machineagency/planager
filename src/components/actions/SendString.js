import React from 'react'
import Draggable from 'react-draggable'

export default class SendString extends React.Component {
  constructor(props) {
  	super(props)
  	this.state = {
  		next: null
  	}
  }

  execute() {
  	console.log("string executed")
  }

  connect() {
  	
  }

  render() {
    return (
      <Draggable>
	      <div className="box">
	        String sender
	        <button onClick={this.connect}>connect</button>
	      </div>
      </Draggable>
    );
  }
}
