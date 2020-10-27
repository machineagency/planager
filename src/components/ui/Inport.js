import React from "react";
import ReactTooltip from 'react-tooltip';
import "./css/Inport.css";

export default class Inport extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    console.log(this.props.name);
  }

  render() {
    return (
      <div>
        <ReactTooltip />
        <button className="inport" onClick={this.onClick} data-tip={this.props.name} />
      </div>
    );
  }
}
