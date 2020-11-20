import React from "react";
import GenericAction from "../GenericAction";

export default class Conditional extends React.Component {
  // Specify default inputs here
  static defaultProps = {
    inportData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      inports: {
          a: null,
          b: null,
      },
      outports: {
          result: null,
      },
    };
  }

  static getDerivedStateFromProps(nextProps) {
    
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        inportData={this.props.inportData}
        outports={this.state.outports}
        actionID={this.props.id}
      >
        <div className="actionTitle">Conditional</div>
        <div className="actionContent">
        
        </div>
      </GenericAction>
    );
  }
}
