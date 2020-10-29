// Import modules
import React from "react";
import { Button } from "semantic-ui-react";

// Import components
import GenericAction from "./GenericAction";

// Import styles
import "./css/Alert.css";

const PORTS = {
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

export default class Alert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  run() {
    console.log("alert thing CLICKED");
  }

  render() {
    return (
      <GenericAction inports={PORTS.inports} outports={PORTS.outports}>
        <div className="actionTitle">Alert</div>
        <div className="actionContent">
          <Button
            icon
            className="ui teal primary button"
            size="mini"
            onClick={this.run}
          >
            Click me!
          </Button>
        </div>
      </GenericAction>
    );
  }
}
