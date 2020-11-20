// Import modules
import React from "react";

// Import components
import GenericAction from "../GenericAction";

// Import styles
import "./LinearArray.css";

export default class LinearArray extends React.Component {
  // Specify default inputs here
  static defaultProps = {
    inportData: {},
  };

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

  // This can fill really massive arrays fast bc logn
  fillArray(value, len) {
    if (len === 0) return [];
    var a = [value];
    while (a.length * 2 <= len) a = a.concat(a);
    if (a.length < len) a = a.concat(a.slice(0, len - a.length));
    return a;
  }

  arraysEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  componentDidUpdate() {
    let ar = null;
    if (typeof this.props.inportData.length !== "undefined") {
      ar = this.fillArray(
        this.props.inportData.itemIn.value,
        parseInt(this.props.inportData.length.value)
      );

      // We have to do this check because we can't update state directly
      // in a componentDidUpdate() method as that would cause an infinite loop
      if (!this.arraysEqual(this.state.outports.itemOut.value, ar)) {
        let newOutports = { ...this.state.outports };
        newOutports.itemOut.value = ar;
        this.setState({ outports: newOutports });
      }
    }
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
          Array Item:
          {this.props.inportData.itemIn
            ? this.props.inportData.itemIn.value
            : null}
          <br />
          Array length:
          {this.props.inportData.length
            ? this.props.inportData.length.value
            : null}
          <br />
          <br />
          Array: {this.state.outports.itemOut.value}
        </div>
      </GenericAction>
    );
  }
}
