// Import modules
import React from "react";
import { Button } from "semantic-ui-react";

// Import components
import GenericAction from "./GenericAction";

// Import styles
import "./css/Alert.css";

export default class Alert extends React.Component {
  static defaultProps = {
    inportData: {
      itemIn: {
        type: "any",
        value: null,
      },
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      inports: {
        itemIn: {
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

  run() {
    alert(`Value: ${this.props.inportData.itemIn.value}`);
    this.setState({
      outports: {
        itemOut: { type: "any", value: this.props.inportData.itemIn.value },
      },
    });
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        inportData={this.props.inportData}
        outports={this.state.outports}
        actionID={this.props.id}
      >
        <div className="actionTitle">Alert</div>
        <div className="actionContent">
          <Button
            icon
            className="ui teal primary button"
            size="mini"
            onClick={this.run.bind(this)}
          >
            Click me!
          </Button>
        </div>
      </GenericAction>
    );
  }
}
