import React from "react";
import ReactTooltip from "react-tooltip";
import "./css/Inport.css";
import { v4 as uuidv4 } from "uuid";


export default class Inport extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null
    }

    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {

  }
  
  render() {
    return (
      <div>
        <ReactTooltip />
        <button
          className="inport"
          data-inportid={this.props.inportID}
          data-actionid={this.props.actionID}
        />
      </div>
    );
  }
}
