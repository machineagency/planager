// Import modules
import React from "react";
import { Input } from "semantic-ui-react";

// Import components
import GenericAction from "./GenericAction";

// Import styles
import "./css/constant.css";

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
    newOutports.itemOut.value = e.target.value;
    console.log(newOutports);

    this.setState({ outports: newOutports });
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        outports={this.state.outports}
        actionID={this.props.id}
      >
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
