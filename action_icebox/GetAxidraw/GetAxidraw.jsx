import React from "react";

import "./GetAxidraw.css";

export default class AxidrawConnect extends React.Component {
  constructor(props) {
    super(props);
  }
  move(amt, dir) {
    fetch("/runBackendMethod", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "move",
        actionID: this.props.action.id,
        args: { amt: amt, dir: dir },
      }),
    })
      .then((res) => res.json())
      .then((plan) => {
        console.log(plan);
      });
  }
  connect() {
    fetch("/runBackendMethod", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "connect",
        actionID: this.props.action.id,
        args: {},
      }),
    })
      .then((res) => res.json())
      .then((plan) => {
        console.log(plan);
      });
  }
  render() {
    return (
      <div>
        <div
          type='button'
          className='connectButton'
          onClick={this.connect.bind(this)}>
          Connect
        </div>
        <div
          type='button'
          className='moveButton'
          onClick={this.move.bind(this, 1, "x")}>
          +1 inch x
        </div>
        <div
          type='button'
          className='moveButton'
          onClick={this.move.bind(this, -1, "x")}>
          -1 inch x
        </div>
        <div
          type='button'
          className='moveButton'
          onClick={this.move.bind(this, 1, "y")}>
          +1 inch y
        </div>
        <div
          type='button'
          className='moveButton'
          onClick={this.move.bind(this, -1, "")}>
          -1 inch y
        </div>
      </div>
    );
  }
}
