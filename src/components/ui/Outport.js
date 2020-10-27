import React from "react";
import ReactTooltip from 'react-tooltip';
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
        <ReactTooltip />
        <button className="outport" onClick={this.onClick} data-tip={this.props.name}/>
      </div>
    );
  }
}
