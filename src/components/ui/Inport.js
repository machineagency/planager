import React from "react";
import "./css/Inport.css";

export default class Inport extends React.Component {
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
        <button className="inport" onClick={this.onClick} />
      </div>
    );
  }
}
