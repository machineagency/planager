// Import modules
import React from "react";
import { Input, Dropdown } from "semantic-ui-react";

// Import components
import GenericAction from "../GenericAction";

// Import styles
import "./constant.css";

const types = [
  {
    key: "Number",
    text: "Number",
    value: "Number",
  },
  {
    key: "Boolean",
    text: "Boolean",
    value: "Boolean",
  },
  {
    key: "String",
    text: "String",
    value: "String",
  },
];

export default class Constant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: {},
      outports: {
        itemOut: {
          type: "any",
          value: null,
        },
      },
    };
  }

  updateConstant(e) {
    let newOutports = this.state.outports;
    newOutports.itemOut.value = Number(e.target.value);
    this.setState({ outports: newOutports });
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        outports={this.state.outports}
        actionID={this.props.id}
      >
        <div className="actionTitle">
          <Dropdown placeholder="select type" floating inline options={types} />
        </div>
        <div className="actionContent">
          <Input
            fluid
            label="Constant"
            size="mini"
            onChange={this.updateConstant.bind(this)}
          />
        </div>
      </GenericAction>
    );
  }
}
