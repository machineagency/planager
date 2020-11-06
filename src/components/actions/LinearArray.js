// Import modules
import React from "react";

// Import components
import GenericAction from "./GenericAction";

// Import styles
import "./css/LinearArray.css";


export default class LinearArray extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: {
        itemIn: {
          type: "any",
          value: null,
        },
        length: {
          type: "any",
          value: null,
        },
      },
      outports: {
        itemOut: {
          type: "any",
          value: null,
        },
      },
    };
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        outports={this.state.outports}
        actionID={this.props.id}
        inportData={this.props.inportData}
      >
        <div className="actionTitle">Array</div>
        <div className="actionContent">
          {`Item In: ${
            this.props.inportData.itemIn
              ? this.props.inportData.itemIn.value
              : null
          }\n
          Item Out: ${this.state.outports.itemOut.value}`}
        </div>
      </GenericAction>
    );
  }
}
