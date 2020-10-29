import React from "react";
import { Button, Icon } from "semantic-ui-react";
import WorkflowContext from "../../utils/WorkflowContext";
import "./css/Alert.css";

import GenericAction from "./GenericAction";

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
  static contextType = WorkflowContext; // How we access the global context

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
        <>
          <Button
            icon
            className="ui teal primary button"
            size="mini"
            onClick={this.run}
          >
            <Icon name="play" />
          </Button>
        </>
      </GenericAction>
    );
  }
}
