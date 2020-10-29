// Import modules
import React from "react";
import { Input } from "semantic-ui-react";

// Import components
import GenericAction from "./GenericAction";

// Import styles
import "./css/constant.css"

const PORTS = {
  inports: {},
  outports: {
    itemOut: {
      type: "any",
      value: null,
    },
  },
};

export default class Constant extends React.Component {
  constructor(props) {
    super(props);
    this.state = PORTS;
  }

  updateConstant(e) {
    let newOutports = this.state.outports;
    newOutports.itemOut.value = e.target.value;

    this.setState({ outports: newOutports });
  }

  render() {
    return (
      <GenericAction inports={PORTS.inports} outports={PORTS.outports}>
        <div className="actionTitle">Constant</div>
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