import React from "react";
import "./css/Outport.css";

export default class Outport extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    console.log(this.props);
  }

  render() {
    return (
      <div>
        <button className="outport" onClick={this.onClick} />
      </div>
    );
  }
}
