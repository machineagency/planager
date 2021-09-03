import React from "react";
import GenericAction from "../GenericAction";
import Outport from "../../base/Outport";
import "./constant.css";

export default class Constant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outports: [new Outport("Output", "any", null, "a constant")],
    };
  }

  updateConstant(e) {
    let outports = [...this.state.outports];
    outports[0].data = Number(e.target.value);
    this.setState({ outports: outports });
  }

  render() {
    return (
      <GenericAction
        inports={[]}
        outports={this.state.outports}
        actionID={this.props.id}
        positionDeltas={this.props.positionDeltas}
      >
        <div className="actionTitle">Constant</div>
        <div
          className="actionContent"
          style={{ maxWidth: "175px", padding: "10px" }}
        >
            <input
              className="constantText"
              onChange={this.updateConstant.bind(this)}
              style={{ textAlign: "center", fontSize: "24px"  }}
            />
        </div>
      </GenericAction>
    );
  }
}
